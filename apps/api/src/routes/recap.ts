import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';

const router = Router();

// Retrieve full recap
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const recap = await prisma.recap.findUnique({
      where: { slug: req.params.id }
    });

    if (!recap) {
      return res.status(404).json({
        ok: false,
        error: { code: 'RECAP_NOT_FOUND', message: 'Recap not found.' }
      });
    }

    const profile = JSON.parse(recap.profileJson as string);
    const stats = JSON.parse(recap.statsJson as string);
    const receipt = JSON.parse(recap.receiptJson as string);

    return res.status(200).json({
      ok: true,
      recap: {
        id: recap.slug,
        createdAt: recap.createdAt,
        dateRange: {
          start: recap.dateRangeStart,
          end: recap.dateRangeEnd
        },
        profile,
        stats,
        persona: stats.persona || { title: recap.persona },
        receipt
      }
    });
  } catch (error: any) {
    console.error('Recap get error:', error);
    return res.status(500).json({
      ok: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to retrieve recap.' }
    });
  }
});

// Sanitized share data
router.get('/share/:id', async (req: Request, res: Response) => {
  try {
    const recap = await prisma.recap.findUnique({
      where: { slug: req.params.id }
    });

    if (!recap) {
      return res.status(404).json({
        ok: false,
        error: { code: 'RECAP_NOT_FOUND', message: 'Recap not found.' }
      });
    }

    const profile = JSON.parse(recap.profileJson as string);
    const stats = JSON.parse(recap.statsJson as string);
    const receipt = JSON.parse(recap.receiptJson as string);

    // Sanitize profile info (ensure no email/phone is stored, which our parser doesn't do anyway)
    // Return a restricted set of properties to make absolutely sure
    const cleanProfile = {
      displayName: profile.displayName,
      username: profile.username,
      bio: profile.bio,
      profilePhoto: profile.profilePhoto,
      region: profile.region,
      socialLinks: profile.socialLinks || {}
    };

    return res.status(200).json({
      ok: true,
      recap: {
        id: recap.slug,
        createdAt: recap.createdAt,
        profile: cleanProfile,
        stats,
        persona: stats.persona || { title: recap.persona },
        receipt
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to retrieve shareable recap.' }
    });
  }
});

// Retrieve receipt data
router.get('/receipt/:id', async (req: Request, res: Response) => {
  try {
    const recap = await prisma.recap.findUnique({
      where: { slug: req.params.id }
    });

    if (!recap) {
      return res.status(404).json({
        ok: false,
        error: { code: 'RECAP_NOT_FOUND', message: 'Receipt not found.' }
      });
    }

    const receipt = JSON.parse(recap.receiptJson as string);
    return res.status(200).json({
      ok: true,
      receipt
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to retrieve receipt.' }
    });
  }
});

// Delete recap
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { deleteToken } = req.body;
    if (!deleteToken) {
      return res.status(400).json({
        ok: false,
        error: { code: 'INVALID_DELETE_TOKEN', message: 'Deletion token is required.' }
      });
    }

    const recap = await prisma.recap.findUnique({
      where: { slug: req.params.id }
    });

    if (!recap) {
      return res.status(404).json({
        ok: false,
        error: { code: 'RECAP_NOT_FOUND', message: 'Recap not found.' }
      });
    }

    const hash = crypto.createHash('sha256').update(deleteToken).digest('hex');
    if (hash !== recap.deleteTokenHash) {
      return res.status(403).json({
        ok: false,
        error: { code: 'INVALID_DELETE_TOKEN', message: 'Invalid deletion token.' }
      });
    }

    await prisma.recap.delete({
      where: { slug: req.params.id }
    });

    return res.status(200).json({
      ok: true,
      deleted: true
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to delete recap.' }
    });
  }
});

export default router;
