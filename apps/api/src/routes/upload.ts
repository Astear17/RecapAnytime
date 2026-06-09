import { Router, Request, Response } from 'express';
import multer from 'multer';
import JSZip from 'jszip';
import crypto from 'crypto';
import { parseTikTokJson } from '../lib/tiktok/parser';
import { calculateWatchStats, calculateSearchStats, calculateSpendingStats, calculateLiveStats, calculateEngagementStats } from '../lib/tiktok/statistics';
import { determinePersona } from '../lib/tiktok/persona';
import { generateReceiptData } from '../lib/tiktok/receipt';
import prisma from '../lib/prisma';

const router = Router();
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB — real TikTok JSON exports can be 20–40 MB+
  }
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: { code: 'NO_FILE_UPLOADED', message: 'Please upload a file.' }
      });
    }

    const { originalname, buffer } = req.file;
    let rawJsonText = '';
    let sourceFileType = 'json';

    if (originalname.endsWith('.zip')) {
      sourceFileType = 'zip';
      try {
        const zip = await JSZip.loadAsync(buffer);
        // Look for user_data_tiktok.json or fallback to any JSON
        let jsonFile = zip.file('user_data_tiktok.json');
        if (!jsonFile) {
          // Look for any file ending in .json or containing _tiktok
          const found = Object.keys(zip.files).find(
            name => name.endsWith('.json') && !name.startsWith('__MACOSX')
          );
          if (found) {
            jsonFile = zip.file(found);
          }
        }

        if (!jsonFile) {
          return res.status(400).json({
            ok: false,
            error: {
              code: 'JSON_NOT_FOUND',
              message: 'Could not find a TikTok JSON export inside this ZIP. Make sure you downloaded the JSON/machine-readable version from TikTok.'
            }
          });
        }

        rawJsonText = await jsonFile.async('text');
      } catch (err: any) {
        return res.status(400).json({
          ok: false,
          error: { code: 'ZIP_EXTRACTION_FAILED', message: 'Failed to extract ZIP file.' }
        });
      }
    } else if (originalname.endsWith('.json')) {
      rawJsonText = buffer.toString('utf-8');
    } else if (originalname.endsWith('.txt')) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'UNSUPPORTED_FILE_TYPE',
          message: 'This looks like a TXT export. RecapAnytime only supports JSON/machine-readable exports.'
        }
      });
    } else {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'UNSUPPORTED_FILE_TYPE',
          message: 'Unsupported file type. Please upload a TikTok JSON or ZIP export.'
        }
      });
    }

    // Parse JSON
    let parsedData;
    try {
  parsedData = parseTikTokJson(rawJsonText);
} catch (err: any) {
  console.error('TikTok parser error:', {
    message: err?.message,
    stack: err?.stack
  });

  const isJsonSyntaxError = err?.message === 'JSON_PARSE_FAILED';

  return res.status(400).json({
    ok: false,
    error: {
      code: isJsonSyntaxError ? 'JSON_PARSE_FAILED' : 'PARSER_UNSUPPORTED_STRUCTURE',
      message: isJsonSyntaxError
        ? 'The file is not valid JSON. If this is a ZIP, make sure it contains the machine-readable TikTok JSON export.'
        : 'The JSON is valid, but its TikTok export structure is not supported by the current parser yet.'
    }
  });
}

    if (parsedData.watchItems.length === 0 && parsedData.likeItems.length === 0) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'NO_USABLE_ACTIVITY',
          message: 'No usable TikTok activity data was found in the upload.'
        }
      });
    }

    // Calculations
    const watchStats = calculateWatchStats(parsedData.watchItems);
    const searchStats = calculateSearchStats(parsedData.searchItems);
    const liveStats = calculateLiveStats(parsedData.liveItems);
    const spendingStats = calculateSpendingStats(
      parsedData.shopItems,
      parsedData.spendingItems,
      parsedData.productBrowsingCount
    );
    const engagementStats = calculateEngagementStats(
      parsedData.likeItems,
      parsedData.commentItems,
      parsedData.shareItems,
      parsedData.repostItems,
      parsedData.postItems,
      watchStats.totalVideos
    );

    const persona = determinePersona(watchStats, searchStats, liveStats, spendingStats, engagementStats);
    const receipt = generateReceiptData(parsedData.profile, watchStats, searchStats, liveStats, spendingStats, engagementStats, persona);

    const dateRangeStart = watchStats.firstWatchAt ? new Date(watchStats.firstWatchAt) : null;
    const dateRangeEnd = watchStats.lastWatchAt ? new Date(watchStats.lastWatchAt) : null;

    // Generate deletion token
    const deleteToken = crypto.randomBytes(16).toString('hex');
    const deleteTokenHash = crypto.createHash('sha256').update(deleteToken).digest('hex');

    const slug = crypto.randomBytes(8).toString('hex');

    const recap = await prisma.recap.create({
      data: {
        slug,
        deleteTokenHash,
        sourceFileType,
        rawFileDeleted: true, // We never write raw files to disk
        dateRangeStart,
        dateRangeEnd,
        persona: persona.title,
        profileJson: JSON.stringify(parsedData.profile),
        statsJson: JSON.stringify({
          watch: watchStats,
          engagement: engagementStats,
          searches: searchStats,
          live: liveStats,
          spending: spendingStats
        }),
        receiptJson: JSON.stringify(receipt)
      }
    });

    return res.status(200).json({
      ok: true,
      recapId: recap.slug,
      slug: recap.slug,
      deleteToken,
      redirectUrl: `/recap/${recap.slug}`
    });

  } catch (error: any) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      ok: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to save recap data.' }
    });
  }
});

export default router;
