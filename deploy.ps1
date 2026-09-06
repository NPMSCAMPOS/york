cd 'C:\Users\Nara Campos\projects\york'
$env:Path += ';C:\Program Files\Git\cmd'
git add vercel.json
git commit -m "Fix Vercel deployment: adicionar root:frontend no vercel.json para monorepo"
git push origin main
Write-Host "Deploy realizado! Vercel vai refazer o build em 30-60 segundos."
pause
powershell -ExecutionPolicy Bypass .\deploy.ps1
