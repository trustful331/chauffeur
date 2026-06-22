export function BookingPage() {
  return (
    <section className="space-y-8">
      <article className="rounded-[20px] border border-[#eaecf0] bg-white p-8">
        <h2 className="text-4xl font-bold text-[#101828]">Booking Flow</h2>
        <p className="mt-3 text-[#475467]">Ride Details → Choose Fleet → Passenger Details → Confirm</p>
      </article>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[16px] border border-[#eaecf0] bg-white p-6">
          <h3 className="text-2xl font-bold text-[#101828]">Ride Details</h3>
          <div className="mt-4 space-y-3">
            {[
              'One Way journey / Round Trip',
              'Pick Up Location',
              'Drop Off Location',
              'Pickup Date and Time',
              'No of Passengers',
            ].map((field) => (
              <div key={field} className="rounded-[10px] border border-[#d0d5dd] px-4 py-3 text-sm text-[#667085]">
                {field}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[16px] border border-[#eaecf0] bg-white p-6">
          <h3 className="text-2xl font-bold text-[#101828]">Choose Fleet</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['SEDAN', 'SUV', 'VAN'].map((x) => (
              <button key={x} className="rounded-[10px] border border-[#d0d5dd] py-2 text-sm font-bold text-[#344054]">
                {x}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#475467]">Mercedes S-Class / Cadillac Escalade / Mercedes V-Class</p>
          <button className="mt-5 w-full rounded-[10px] bg-[#f2b900] px-4 py-3 text-sm font-black text-[#101828]">
            Next
          </button>
        </article>
      </div>
    </section>
  )
}
