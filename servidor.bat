@echo off
cd /d "t:\gerador_lotofacil"
echo Iniciando servidor local na porta 8000...
echo Acesse: http://localhost:8000
echo Para parar o servidor, pressione Ctrl+C

powershell -Command "& {
    Add-Type -AssemblyName System.Web
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add('http://localhost:8000/')
    $listener.Start()
    Write-Host 'Servidor rodando em http://localhost:8000'
    Write-Host 'Pressione Ctrl+C para parar'
    
    try {
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $path = $request.Url.LocalPath
            if ($path -eq '/' -or $path -eq '') {
                $path = '/index.html'
            }
            
            $filePath = Join-Path (Get-Location) $path.TrimStart('/')
            Write-Host "Requisição: $path -> $filePath"
            
            if (Test-Path $filePath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                
                switch ($ext) {
                    '.html' { $response.ContentType = 'text/html; charset=utf-8' }
                    '.css'  { $response.ContentType = 'text/css; charset=utf-8' }
                    '.js'   { $response.ContentType = 'application/javascript; charset=utf-8' }
                    '.json' { $response.ContentType = 'application/json; charset=utf-8' }
                    '.png'  { $response.ContentType = 'image/png' }
                    '.jpg'  { $response.ContentType = 'image/jpeg' }
                    '.ico'  { $response.ContentType = 'image/x-icon' }
                    default { $response.ContentType = 'text/plain' }
                }
                
                $response.StatusCode = 200
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
                $notFound = [System.Text.Encoding]::UTF8.GetBytes('Arquivo não encontrado: ' + $filePath)
                $response.ContentLength64 = $notFound.Length
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
            
            $response.Close()
        }
    } catch {
        Write-Host 'Servidor parado'
    } finally {
        $listener.Stop()
    }
}"