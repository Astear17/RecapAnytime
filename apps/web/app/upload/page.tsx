'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, FileCode, CheckCircle, AlertOctagon, Terminal, Trash2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

type UploadState =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'extracting_zip'
  | 'parsing_json'
  | 'calculating_stats'
  | 'creating_recap'
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
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate state progression for UI feel
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/api/upload`, true);

      xhr.onload = () => {
        clearInterval(interval);
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
        clearInterval(interval);
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
        return 'Drag & drop your ZIP/JSON export';
      case 'selected':
        return `Selected: ${file?.name}`;
      case 'uploading':
        return `Uploading file... ${progress}%`;
      case 'extracting_zip':
        return 'Extracting archive zip...';
      case 'parsing_json':
        return 'Parsing user_data_tiktok.json...';
      case 'calculating_stats':
        return 'Running statistics aggregator...';
      case 'creating_recap':
        return 'Preparing story boards...';
      case 'done':
        return 'Recap compilation complete!';
      case 'error':
        return 'Parsing process crashed';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-24 font-mono text-sm">
      <header className="mb-12 flex items-center justify-between border-b border-panel-border pb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-accent-cyan" />
          <Link href="/" className="font-bold text-foreground">RecapAnytime</Link>
        </div>
        <span className="text-xs text-muted">/upload_manager</span>
      </header>

      <main className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">Parser Terminal</h1>
          <p className="text-xs text-muted leading-relaxed">
            Upload your `user_data_tiktok.json` or standard `.zip` file from TikTok. Max file size: 100MB. 
            Raw files are parsed immediately in memory and are never saved permanently.
          </p>
        </div>

        {/* Dropzone */}
        {uploadState !== 'done' && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-sm p-12 text-center transition-all ${
              uploadState === 'selected'
                ? 'border-accent-green bg-panel/30'
                : uploadState === 'error'
                ? 'border-accent-red bg-accent-red/5'
                : 'border-panel-border hover:border-accent-cyan hover:bg-panel/10'
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
                    or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-accent-cyan underline hover:text-cyan-400"
                    >
                      browse local drive
                    </button>
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              {uploadState === 'uploading' && (
                <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden border border-panel-border max-w-xs mt-2">
                  <div
                    className="bg-accent-cyan h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {uploadState === 'selected' && (
                <button
                  onClick={triggerUpload}
                  className="bg-accent-green hover:bg-[#6be45d] text-background px-6 py-2 font-bold rounded-sm transition-all"
                >
                  Parse TikTok Export
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
              <p className="font-bold text-accent-red">Error Code: PARSE_CRASH</p>
              <p className="text-muted leading-normal">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success / Done State */}
        {uploadState === 'done' && (
          <div className="space-y-6">
            <div className="bg-panel border border-accent-green/30 p-6 rounded-sm space-y-4">
              <div className="flex items-center space-x-3 text-accent-green">
                <CheckCircle className="h-6 w-6" />
                <span className="font-bold text-lg">Recap Compiled Successfully!</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Your TikTok export data has been processed, and derived stats are stored. You can now view your story.
              </p>

              {/* Deletion Token Notification */}
              <div className="border border-panel-border bg-[#0a0a0a] p-4 rounded-sm space-y-2">
                <div className="flex items-center space-x-2 text-accent-red font-bold text-xs">
                  <Trash2 className="h-4 w-4" />
                  <span>CRITICAL PRIVACY WARNING - DELETION TOKEN</span>
                </div>
                <p className="text-[11px] text-muted">
                  Use this token to delete your recap permanently. It will not be shown again:
                </p>
                <div className="bg-[#121212] p-2 border border-panel-border font-mono text-center text-base font-bold text-foreground select-all rounded-sm tracking-wide">
                  {deleteToken}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/recap/${recapId}`}
                  className="flex items-center justify-center space-x-2 bg-accent-cyan hover:bg-[#1fdad5] text-background px-6 py-3 font-bold rounded-sm transition-all text-center w-full"
                >
                  <span>Launch Interactive Recap</span>
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
