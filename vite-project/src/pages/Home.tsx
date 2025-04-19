import { useState } from 'react'
import QrScanner from 'qr-scanner'
import { QrCode, StopCircle } from 'lucide-react'

// Extend the Window interface to include QRScanner
// declare global {
//   interface Window {
//     QRScanner?: {
//       scan: (callback: (err: unknown, text: string) => void) => void;
//       hide: () => void;
//     };
//   }
// }

export interface Item {
  SITECODE: string
  STORECODE: string
  STOCKGROUPCODE: string
  ITEMCODE: string
  ITEMDESCRIPTION: string
  UOMCODE: string
  QTYONHAND: number
  Timestamp: string
}

interface ApiResponse {
  status: number
  message?: string
  data?: Item
}

const apiUrl = "https://script.google.com/macros/s/AKfycbyC_LSHlZhLnftxFAeFPhsMWn2EVayH-vJqMF0F7PJIAEPhdkP9AClSKEKKfPXuHaBb/exec"
let qrScanner: QrScanner | null = null

export default function Home() {
  const [item, setItem] = useState<Item | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  function scan() {
    if (isScanning) return;
    setIsScanning(true)
    setItem(undefined)
    setError(undefined)

    const videoElem = document.getElementById('qr-video');

    qrScanner = new QrScanner(
      videoElem as HTMLVideoElement,
      async (r: string) => {
        setError(undefined)
        setIsScanning(false)

        qrScanner?.stop()
        qrScanner?.destroy()
        qrScanner = null

        setIsLoading(true)
        await fetchItem(r)
        setIsLoading(false)
      },
      (error: Error | string) => {
        if (error instanceof Error) setError(error.message)
        else setError(error)
      }
    )

    qrScanner.start().catch(err => {
      setError(err);
    });
  }

  function stopScan() {
    if (!isScanning) return;

    // reset state
    setIsScanning(false)
    setError(undefined)
    setItem(undefined)

    // stop the scanner
    if (!qrScanner) return;
    qrScanner?.stop()
    qrScanner?.destroy()
    qrScanner = null
  }

  async function fetchItem(code: string) {
    const res = await fetch(`${apiUrl}?action=get&itemCode=${code}`, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })

    const json: ApiResponse = await res.json();

    if (!res.ok) {
      return setError(res.statusText);
    }

    if (json.status != 200) {
      return setError(json.message);
    }

    setItem(json.data);
  }

  async function showStockForm() {
    const newStock = window.prompt('Update Stock', item?.QTYONHAND.toString());

    if (!newStock) return;

    if (Number(newStock) == item?.QTYONHAND) {
      return;
    }

    if (isNaN(Number(newStock))) {
      return alert('Invalid stock value');
    }

    if (Number(newStock) < 0) {
      return alert('Stock value cannot be negative');
    }

    if (Number(newStock) > 99999999) {
      return alert('Stock value is too large');
    }

    setIsUpdating(true);
    await updateStock(newStock);
    setIsUpdating(false);
  }

  async function updateStock(newStock: string) {
    const res = await fetch(`${apiUrl}?action=update&itemCode=${item?.ITEMCODE}&newStock=${newStock}`, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })

    const json: ApiResponse = await res.json();

    if (!res.ok) {
      return setError(res.statusText);
    }

    if (json.status != 200) {
      return setError(json.message);
    }

    setItem(json.data);
  }

  return (
    <main className="p-8 h-screen w-screen flex flex-col gap-3 items-center justify-end">
      <section className='flex flex-col gap-5 items-center justify-center'>
        {/* <video id="qr-video" className='border-2 border-green-500 h-[300px] w-[300px] rounded-lg'></video> */}
        <video id="qr-video"></video>

        {item && (
          <div className="w-full">
            <h3 className="text-lg font-bold text-slate-600 mb-4 text-center">{item.ITEMDESCRIPTION}</h3>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Item Code</div>
              <div className='font-bold'> {item.ITEMCODE} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Site Code</div>
              <div className='font-bold'> {item.SITECODE} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Store Code</div>
              <div className='font-bold'> {item.STORECODE} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Stock Group Code</div>
              <div className='font-bold'> {item.STOCKGROUPCODE} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>UOM Code</div>
              <div className='font-bold'> {item.UOMCODE} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Qty On Hand</div>
              <div className='font-bold'> {item.QTYONHAND} </div>
            </div>

            <div className='flex gap-2 justify-between'>
              <div className='text-slate-400'>Last Update</div>
              <div className='font-bold'>
                {
                  item.Timestamp
                    ? new Date(item.Timestamp)
                      .toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
              </div>
            </div>

            <button disabled={isUpdating} onClick={() => showStockForm()} className='border-1 border-green-500 text-green-500 rounded-lg p-2 flex items-center gap-2 w-full justify-center mt-8'>
              {isUpdating ? 'Updating Data...' : "Update Stock"}
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-slate-500">
            Fetching Data...
          </div>
        )}

        {!isScanning && <button disabled={isUpdating} onClick={() => scan()} className="bg-green-500 text-white rounded-lg p-2 flex items-center gap-2 w-full justify-center">
          <QrCode />
        </button>}

        {isScanning && <button onClick={() => stopScan()} className="bg-red-500 text-white rounded-lg p-2 flex items-center gap-2 w-full justify-center">
          <StopCircle />
        </button>}
      </section>
    </main>
  )
}