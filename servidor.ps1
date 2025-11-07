# Servidor HTTP simples para LotoFácil Estratégica
# Execute este arquivo com: powershell -ExecutionPolicy Bypass -File servidor.ps1

Set-Location "t:\gerador_lotofacil"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "==================================================="
Write-Host "🚀 Servidor HTTP iniciado com sucesso!" -ForegroundColor Green
Write-Host "📍 URL: http://localhost:8000" -ForegroundColor Yellow
Write-Host "📁 Pasta: $(Get-Location)" -ForegroundColor Cyan
Write-Host "⏹️  Para parar: Ctrl+C" -ForegroundColor Red
Write-Host "==================================================="

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }
        
        $filePath = Join-Path (Get-Location) $path.TrimStart('/')
        Write-Host "📥 Requisição: $($request.HttpMethod) $path" -ForegroundColor Gray
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            # Definir Content-Type baseado na extensão
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "text/plain" }
            }
            
            $response.StatusCode = 200
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "✅ Arquivo servido: $filePath" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("Arquivo não encontrado: $path")
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            Write-Host "❌ Arquivo não encontrado: $filePath" -ForegroundColor Red
        }
        
        $response.Close()
    }
}
catch {
    Write-Host "⏹️  Servidor interrompido" -ForegroundColor Yellow
}
finally {
    $listener.Stop()
    $listener.Dispose()
    Write-Host "🔒 Servidor finalizado" -ForegroundColor Red
}