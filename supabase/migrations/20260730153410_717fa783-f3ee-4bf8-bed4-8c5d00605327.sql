
CREATE POLICY "Admins manage product images" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');
