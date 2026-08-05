ALTER TABLE public.payment_methods
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'crypto',
  ADD COLUMN IF NOT EXISTS handle text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS review_note text NOT NULL DEFAULT '';

INSERT INTO public.payment_methods (name, symbol, network, address, instructions, confirmations, sort_order, active, kind, handle, review_note)
VALUES
  ('Cash App', 'CASHAPP', 'Cash App', '', 'Submit your order and contact details. Our finance desk reviews the order and sends you a payment request with the exact Cash App $Cashtag and amount. After you pay, reply with a screenshot of the completed payment so we can confirm and ship.', 1, 7, true, 'cashapp', '', 'A payment request is sent by email or WhatsApp within business hours. Only pay to the $Cashtag we send you directly.'),
  ('Chime', 'CHIME', 'Chime', '', 'Submit your order and contact details. Our finance desk reviews the order and sends you a Chime payment request with the exact amount. After you pay, reply with a screenshot of the completed payment so we can confirm and ship.', 1, 8, true, 'chime', '', 'A payment request is sent by email or WhatsApp within business hours. Only pay to the Chime handle we send you directly.'),
  ('Bank Transfer', 'BANK', 'ACH / Wire / SWIFT', '', 'Send us a message with your order and billing details. Our finance team reviews the request and replies with the full bank account details (account name, number, routing/SWIFT and reference) so you can complete the transfer from your bank.', 1, 9, true, 'bank', '', 'Bank account details are never published online — they are sent to you directly after review to protect you from payment fraud.');