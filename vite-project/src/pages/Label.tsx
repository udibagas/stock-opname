import { useEffect, useState } from "react"
import { Item } from "./Home"
import QRCode from "react-qr-code";

const apiUrl = 'https://script.google.com/macros/s/AKfycbx9XUYjd17pIrUcCynRufXAyX58TS4Agi2IFyEZqAvjFcGLqhDJw7N9pcexEX8Oo9Ye8A/exec?action=getAll';

export default function Label() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const allData = data.data.slice(1).filter((x: any[]) => x[7] > 0)

        const allItems = allData.map((x: string[]) => {
          const [SITECODE, STORECODE, RACKCODE, STOCKGROUPCODE, ITEMCODE, ITEMDESCRIPTION, UOMCODE, QTYONHAND, QTYREAL, Timestamp] = x;
          return {
            SITECODE,
            STORECODE,
            RACKCODE,
            STOCKGROUPCODE,
            ITEMCODE,
            ITEMDESCRIPTION,
            UOMCODE,
            QTYONHAND,
            QTYREAL,
            Timestamp
          }
        }).sort((a: Item, b: Item) => {
          if (a.RACKCODE < b.RACKCODE) return -1
          if (a.RACKCODE > b.RACKCODE) return 1
        })

        setItems(allItems)
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
      <h1 className="text-3xl text-center mb-8">STOCK OPNAME PT. SNS</h1>
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="flex gap-4 flex-wrap items-center justify-center">
        {items.map((item, index) => {
          const breakPage = index % 14 === 0 && index !== 0;

          return (
            <div key={index} className={`flex gap-2 border-1 border-slate-400 p-2 w-[300px] h-[100px] items-center ${breakPage ? 'break-after-page' : ''}`}>
              <div className="w-[80px] h-[80px]">
                <QRCode size={80} value={item.ITEMCODE} />
              </div>
              <div className="w-full">
                <div className="flex justify-between">
                  <div className="font-bold">PT SNS</div>
                  <div className="font-bold text-red-500">{item.RACKCODE}</div>
                </div>
                <div className="text-bold line-clamp-1">{item.ITEMDESCRIPTION}</div>
                <div className="text-bold">{item.ITEMCODE}</div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}