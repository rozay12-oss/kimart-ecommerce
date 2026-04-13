import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { record } = await req.json()
    console.log("Processing order for:", record.id)

    // Your logic to send the email/receipt goes here...

    return new Response(JSON.stringify({ message: "Receipt Processed" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})