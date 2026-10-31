import type { VehiculoFacturaPdfData } from "./vehiculo-invoice-data";

export function VehiculoFacturaHtmlPreview({
  data,
}: {
  data: VehiculoFacturaPdfData;
}) {
  return (
    <div className="h-full min-h-0 w-full overflow-auto bg-white text-black">
      <div className="mx-auto w-full max-w-[720px] px-8 py-10 text-[11px] leading-snug">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div>
            {data.logoSrc ? (
              <img src={data.logoSrc} alt="" className="mb-2 h-auto w-[100px]" />
            ) : null}
            <div className="mt-2 space-y-0.5">
              <p>3651 DANBURY ROAD</p>
              <p>BREWSTER, NY 10509</p>
            </div>
          </div>
          <div className="w-[180px] shrink-0">
            <p className="mb-1 text-right text-[10px] font-bold text-[#e11d48]">
              INVOICE No. {data.invoiceNumber}
            </p>
            <div className="flex border border-black">
              <p className="w-[40%] border-r border-black px-1.5 py-1 text-center">
                DATE
              </p>
              <p className="w-[60%] px-1.5 py-1 text-center text-[#e11d48]">
                {data.invoiceDateDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 border border-black">
          <div className="flex border-b border-black">
            <p className="w-20 shrink-0 border-r border-black p-2 font-bold">
              BILL TO
            </p>
            <p className="flex-1 p-2 text-[#e11d48]">
              {data.customerName} . NIT {data.customerNit}
            </p>
          </div>
          <div className="flex">
            <p className="w-20 shrink-0 border-r border-black p-2 font-bold">
              ADDRESS
            </p>
            <p className="flex-1 p-2 text-[#e11d48]">{data.customerAddress}</p>
          </div>
        </div>

        <div className="mb-5 border border-black">
          <div className="flex border-b border-black">
            <p className="w-[60%] border-r border-black p-2 text-center">
              DESCRIPTION
            </p>
            <p className="w-[20%] border-r border-black p-2 text-center">
              UNIT PRICE
            </p>
            <p className="w-[20%] p-2 text-center">AMOUNT</p>
          </div>
          <div className="flex min-h-10 border-b border-black">
            <p className="w-[60%] border-r border-black p-2 text-[#e11d48]">
              {data.carDescription}
            </p>
            <p className="w-[20%] border-r border-black p-2" />
            <p className="w-[20%] p-2 text-right text-[#e11d48]">
              {data.unitPrice}
            </p>
          </div>
          <div className="flex min-h-8">
            <p className="w-[60%] border-r border-black p-2" />
            <p className="w-[20%] border-r border-black p-2" />
            <p className="w-[20%] p-2" />
          </div>
        </div>

        <div className="mb-16 flex justify-between gap-6">
          <div className="flex h-[100px] w-[60%] flex-col justify-between border border-black p-2.5">
            <p className="text-left">{data.terms}</p>
            <p className="w-full text-center text-[11px] font-bold">
              INCOTERMS {data.incoterms}
            </p>
          </div>
          <div className="w-[35%]">
            <div className="mb-0 flex">
              <div className="w-1/2 border border-black p-1.5 text-right text-[#e11d48]">
                {data.subTotal}
              </div>
              <p className="w-1/2 p-1.5">SUB TOTAL</p>
            </div>
            <div className="flex">
              <div className="w-1/2 border border-black p-1.5 text-right text-[#e11d48]">
                {data.total}
              </div>
              <p className="w-1/2 p-1.5">TOTAL</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-8">
          <p className="w-[40%] border-t border-black pt-1.5 text-center text-[8px] font-bold">
            BUYER SIGNATURE
          </p>
          <p className="w-[40%] border-t border-black pt-1.5 text-center text-[8px] font-bold">
            SELLER SIGNATURE
          </p>
        </div>

        <p className="mt-10 text-center text-[8px]">
          3651 Danbury Road Brewster, NY 10509, Used Automobile Dealer tel. +1
          (845) 309-7936.
        </p>
      </div>
    </div>
  );
}
