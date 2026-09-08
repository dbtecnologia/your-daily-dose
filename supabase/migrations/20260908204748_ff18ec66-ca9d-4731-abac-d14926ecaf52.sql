CREATE POLICY "veiculos_fotos_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'veiculos');
CREATE POLICY "veiculos_fotos_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'veiculos' AND public.is_admin());
CREATE POLICY "veiculos_fotos_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'veiculos' AND public.is_admin());
CREATE POLICY "veiculos_fotos_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'veiculos' AND public.is_admin());