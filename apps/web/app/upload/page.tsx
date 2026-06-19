'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, FileCode, CheckCircle, AlertOctagon, Terminal, Trash2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage, t } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/LanguageToggle';

type UploadState =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'parsing'
  | 'done'
  | 'error';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteToken, setDeleteToken] = useState('');
  const [recapId, setRecapId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { lang, toggle } = useLanguage();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage('');
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      setUploadState('error');
      setErrorMessage('This looks like a TXT export. RecapAnytime only supports JSON/machine-readable exports.');
      return;
    }
    if (ext !== 'zip' && ext !== 'json') {
      setUploadState('error');
      setErrorMessage('Unsupported file type. Please upload a TikTok JSON or ZIP export.');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setUploadState('error');
      setErrorMessage('The file is too large. Max file size is 100MB.');
      return;
    }

    setFile(selectedFile);
    setUploadState('selected');
  };

  const triggerUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/api/upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.upload.onload = () => {
        setUploadState('parsing');
        setProgress(0);
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setProgress(100);
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.ok) {
              setDeleteToken(res.deleteToken);
              setRecapId(res.slug);
              setUploadState('done');
            } else {
              setUploadState('error');
              setErrorMessage(res.error?.message || 'Failed to parse TikTok export.');
            }
          } catch (_) {
            setUploadState('error');
            setErrorMessage('Received invalid response from server.');
          }
        } else {
          setUploadState('error');
          try {
            const errJson = JSON.parse(xhr.responseText);
            setErrorMessage(errJson.error?.message || 'An error occurred during parsing.');
          } catch (_) {
            setErrorMessage('Server error. Failed to parse TikTok export.');
          }
        }
      };

      xhr.onerror = () => {
        setUploadState('error');
        setErrorMessage('Network error. Make sure backend is running.');
      };

      xhr.send(formData);

    } catch (err: any) {
      setUploadState('error');
      setErrorMessage(err.message || 'An error occurred.');
    }
  };

  const getStatusText = () => {
    switch (uploadState) {
      case 'idle':
        return t('Kéo thả file ZIP/JSON vào đây', 'Drag & drop your ZIP/JSON export', lang);
      case 'selected':
        return `${t('Đã chọn', 'Selected', lang)}: ${file?.name}`;
      case 'uploading':
        return `${t('Đang tải file lên', 'Uploading file', lang)}... ${progress}%`;
      case 'parsing':
        return t('Đang phân tích dữ liệu TikTok...', 'Parsing TikTok data...', lang);
      case 'done':
        return t('Recap đã sẵn sàng!', 'Recap compiled!', lang);
      case 'error':
        return t('Có lỗi xảy ra', 'An error occurred', lang);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-24 font-mono text-sm">
      <header className="mb-12 flex items-center justify-between border-b border-panel-border pb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-accent-cyan" />
          <Link href="/" className="font-bold text-foreground">RecapAnytime</Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle lang={lang} onToggle={toggle} />
          <span className="text-xs text-muted">/upload_manager</span>
        </div>
      </header>

      <main className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">{t('Trình phân tích', 'Parser Terminal', lang)}</h1>
          <p className="text-xs text-muted leading-relaxed">
            {t(
              'Tải lên file `user_data_tiktok.json` hoặc `.zip` từ TikTok. Tối đa 100MB. File chỉ xử lý trong RAM, không lưu trữ vĩnh viễn.',
              'Upload your `user_data_tiktok.json` or standard `.zip` file from TikTok. Max 100MB. Files are parsed in memory and never stored permanently.',
              lang
            )}
          </p>
        </div>

        {/* Dropzone */}
        {uploadState !== 'done' && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`dropzone-animated p-12 text-center ${
              uploadState === 'selected'
                ? 'active'
                : uploadState === 'error'
                ? 'error'
                : ''
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".zip,.json"
              className="hidden"
            />

            <div className="flex flex-col items-center space-y-4">
              {file ? (
                <FileCode className={`h-12 w-12 ${uploadState === 'error' ? 'text-accent-red' : 'text-accent-green'}`} />
              ) : (
                <Upload className="h-12 w-12 text-muted" />
              )}

              <div className="space-y-1">
                <p className="font-bold text-foreground">{getStatusText()}</p>
                {!file && (
                  <p className="text-xs text-muted">
                    {t('hoặc', 'or', lang)}{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-accent-cyan underline hover:text-cyan-400"
                    >
                      {t('chọn từ máy', 'browse local drive', lang)}
                    </button>
                  </p>
                )}
              </div>

              {/* Upload Progress Bar */}
              {uploadState === 'uploading' && (
                <div className="w-full space-y-1 max-w-xs mt-2">
                  <div className="flex justify-between font-mono text-[10px] text-muted">
                    <span>{t('Đang tải lên', 'Uploading', lang)}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden border border-panel-border progress-bar-animated">
                    <div
                      className="bg-gradient-to-r from-accent-cyan to-accent-green h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Parsing Progress */}
              {uploadState === 'parsing' && (
                <div className="w-full space-y-1 max-w-xs mt-2">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <div className="w-3 h-3 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="text-accent-cyan">{t('Đang phân tích dữ liệu...', 'Analyzing data...', lang)}</span>
                  </div>
                  <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden border border-panel-border">
                    <div className="bg-accent-cyan h-full rounded-full animate-pulse" style={{ width: '100%' }} />
                  </div>
                </div>
              )}

              {uploadState === 'selected' && (
                <button
                  onClick={triggerUpload}
                  className="bg-accent-green hover:bg-[#6be45d] text-background px-6 py-2 font-bold rounded-sm transition-all"
                >
                  {t('Phân tích dữ liệu TikTok', 'Parse TikTok Export', lang)}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {uploadState === 'error' && (
          <div className="bg-panel border border-accent-red/30 p-4 rounded-sm flex items-start space-x-3 text-xs">
            <AlertOctagon className="h-5 w-5 text-accent-red flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-accent-red">{t('Lỗi phân tích', 'Parse Error', lang)}</p>
              <p className="text-muted leading-normal">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success / Done State */}
        {uploadState === 'done' && (
          <div className="space-y-6 animate-scale-in">
            <div className="bg-panel border border-accent-green/30 p-6 rounded-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-green to-transparent" />
              <div className="flex items-center space-x-3 text-accent-green">
                <CheckCircle className="h-6 w-6" />
                <span className="font-bold text-lg">{t('Recap đã sẵn sàng!', 'Recap Compiled!', lang)}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {t('Dữ liệu TikTok của bạn đã được phân tích. Bạn có thể xem recap ngay bây giờ.', 'Your TikTok export data has been processed. You can now view your recap.', lang)}
              </p>

              {/* Deletion Token Notification */}
              <div className="border border-panel-border bg-[#0a0a0a] p-4 rounded-sm space-y-2">
                <div className="flex items-center space-x-2 text-accent-red font-bold text-xs">
                  <Trash2 className="h-4 w-4" />
                  <span>{t('MÃ XÓA DỮ LIỆU - QUAN TRỌNG', 'DELETION TOKEN - IMPORTANT', lang)}</span>
                </div>
                <p className="text-[11px] text-muted">
                  {t('Dùng mã này để xóa vĩnh viễn recap. Mã sẽ không hiển thị lại:', 'Use this token to delete your recap permanently. It will not be shown again:', lang)}
                </p>
                <div className="bg-[#121212] p-2 border border-panel-border font-mono text-center text-base font-bold text-foreground select-all rounded-sm tracking-wide">
                  {deleteToken}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/recap/${recapId}`}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-cyan to-accent-green hover:from-[#1fdad5] hover:to-[#6be45d] text-background px-6 py-3 font-bold rounded-sm transition-all text-center w-full shadow-lg shadow-accent-cyan/20"
                >
                  <span>{t('Xem Recap', 'Launch Recap', lang)}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
