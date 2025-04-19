import { useState } from 'react'
import QrScanner from 'qr-scanner'

// Extend the Window interface to include QRScanner
// declare global {
//   interface Window {
//     QRScanner?: {
//       scan: (callback: (err: unknown, text: string) => void) => void;
//       hide: () => void;
//     };
//   }
// }

export default function Home() {
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  function scan() {
    const videoElem = document.getElementById('qr-video');
    const qrScanner = new QrScanner(
      videoElem as HTMLVideoElement,
      (r: string) => {
        qrScanner.stop()
        setError(null)
        setResult(r)
      },
      (error: Error | string) => {
        if (error instanceof Error) setError(error.message)
        else setError(error)
      }
    )

    qrScanner.start().catch(err => {
      console.error('Camera error:', err);
      alert('Cannot access camera: ' + err.message);
    });
  }

  return (
    <main className="h-screen w-screen flex flex-col gap-3 items-center justify-center">
      <video id="qr-video" className='w-full'></video>

      {error && (
        <div className="text-red-500 ">
          {error}
        </div>
      )}

      {result && (
        <div className="text-green-500">
          {result}
        </div>
      )}

      <button onClick={() => scan()} className="bg-blue-500 text-white rounded-full py-2 w-full">SCAN QR CODE</button>
    </main>
  )
}