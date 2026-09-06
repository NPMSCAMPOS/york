cd 'C:\Users\Nara Campos\projects\york'
$env:Path += ';C:\Program Files\Git\cmd'
git add backend/.env.example
git commit -m "Add .env.example for backend configuration"
git push origin main
Write-Host "Commit realizado! Agora vamos fazer o deploy no Render.com"
Write-Host ""
Write-Host "Próximos passos:"
Write-Host "1. Abra https://render.com"
Write-Host "2. Faça login ou crie uma conta"
Write-Host "3. Clique em 'New +' > 'Web Service'"
Write-Host "4. Conecte seu repositório GitHub (narapriscilla25/york)"
Write-Host "5. Configure as variáveis de ambiente conforme .env.example"
Write-Host ""
Write-Host "Pressione Enter para continuar..."
pause
