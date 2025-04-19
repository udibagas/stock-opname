import { useEffect, useState } from "react"
import { Item } from "./Home"
import QRCode from "react-qr-code";

const apiUrl = 'https://script.google.com/macros/s/AKfycbyC_LSHlZhLnftxFAeFPhsMWn2EVayH-vJqMF0F7PJIAEPhdkP9AClSKEKKfPXuHaBb/exec?action=getAll';

export default function Label() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setItems(data.data.slice(1).map((x: string[]) => {
          const [SITECODE, STORECODE, STOCKGROUPCODE, ITEMCODE, ITEMDESCRIPTION, UOMCODE, QTYONHAND, Timestamp] = x;
          return {
            SITECODE,
            STORECODE,
            STOCKGROUPCODE,
            ITEMCODE,
            ITEMDESCRIPTION,
            UOMCODE,
            QTYONHAND,
            Timestamp
          }
        }))
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <main className="m-auto my-8">
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="flex gap-4 flex-wrap items-center justify-center">
        {items.map((item, index) => {
          const breakPage = index % 14 === 0 && index !== 0;

          return (
            <div key={index} className={`flex gap-2 border-1 border-slate-400 p-2 w-[300px] h-[100px] items-center ${breakPage ? 'break-after-page' : ''}`}>
              <div className="w-[80px] h-[80px]">
                <QRCode size={80} value={item.ITEMCODE.toString()} />
              </div>
              <div>
                <h3 className="font-bold">PT SNS</h3>
                <div className="text-bold line-clamp-1">{item.ITEMDESCRIPTION}</div>
                <div className="text-bold">{item.ITEMCODE.toString().padStart(8, '0')}</div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}