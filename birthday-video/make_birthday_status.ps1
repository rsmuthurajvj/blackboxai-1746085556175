# ============================================================
#  2nd Birthday WhatsApp Status Video Maker (1 minute, 1080x1920)
#  Needs: ffmpeg  ->  open PowerShell and run:  winget install ffmpeg
#  Run:   powershell -ExecutionPolicy Bypass -File make_birthday_status.ps1
# ============================================================

# ---------- EDIT THESE ----------
$Folder   = "C:\Users\Admin\Downloads\WhatsApp Unknown 2026-11-04 at 11.03.42 AM"
$Name     = "Our Little Angel"          # put her name here, e.g. "Diya"
$FromLine = "With endless love"         # e.g. "Love, Chithappa"
$Music    = "music.mp3"                 # optional: put a music.mp3 inside $Folder
$Total    = 60                          # final length in seconds
$MaxVideo = 15                          # max seconds used from the video
# --------------------------------

$ErrorActionPreference = "Stop"
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Host "ffmpeg not found. Run:  winget install ffmpeg   then reopen PowerShell." -ForegroundColor Red; exit 1
}

$work = Join-Path $Folder "_status_work"
New-Item -ItemType Directory -Force -Path $work | Out-Null
$font  = "C\:/Windows/Fonts/georgiai.ttf"   # Georgia Italic
$fontB = "C\:/Windows/Fonts/georgiab.ttf"   # Georgia Bold

$photos = Get-ChildItem -LiteralPath $Folder -File | Where-Object { $_.Extension -match '^\.(jpe?g|png|webp)$' } | Sort-Object Name
$videos = Get-ChildItem -LiteralPath $Folder -File | Where-Object { $_.Extension -match '^\.(mp4|mov|3gp|mkv)$' } | Sort-Object Name
if ($photos.Count -eq 0) { Write-Host "No photos found in $Folder" -ForegroundColor Red; exit 1 }
Write-Host "Found $($photos.Count) photos and $($videos.Count) video(s)."

# ----- timing -----
$intro = 5; $outro = 5
$vidDur = 0
if ($videos.Count -gt 0) {
  $d = [double](& ffprobe -v error -show_entries format=duration -of csv=p=0 "$($videos[0].FullName)")
  $vidDur = [math]::Round([math]::Min($d, $MaxVideo), 2)
}
$photoDur = [math]::Round(($Total - $intro - $outro - $vidDur) / $photos.Count, 2)
if ($photoDur -lt 2) { $photoDur = 2 }
Write-Host "Each photo: $photoDur s, video: $vidDur s"

# blurred background + centered photo, soft fade in/out
function Frame([string]$dur) {
  "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:4,eq=brightness=-0.06:saturation=1.1[bg];" +
  "[0:v]scale=1000:1800:force_original_aspect_ratio=decrease[fg];" +
  "[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p"
}
$enc = @("-c:v","libx264","-preset","medium","-crf","20","-r","30","-pix_fmt","yuv420p","-an")
$segs = @()
$i = 0

# ----- 1. Intro title card (first photo blurred behind text) -----
$p0 = $photos[0].FullName
$f = (Frame $intro) + ",scale=2160:3840,zoompan=z='1+0.0008*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30" +
     ",drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill" +
     ",drawtext=fontfile='$fontB':text='Happy 2nd Birthday':fontsize=86:fontcolor=white:x=(w-tw)/2:y=h*0.40:shadowcolor=black@0.6:shadowx=3:shadowy=3:alpha='min(1,t/1.2)'" +
     ",drawtext=fontfile='$font':text='$Name':fontsize=80:fontcolor=0xFFE7A0:x=(w-tw)/2:y=h*0.50:shadowcolor=black@0.6:shadowx=3:shadowy=3:alpha='min(1,max(0,(t-1)/1.2))'" +
     ",drawtext=fontfile='$font':text='04 . 11 . 2024':fontsize=52:fontcolor=white@0.9:x=(w-tw)/2:y=h*0.58:alpha='min(1,max(0,(t-2)/1.2))'" +
     ",fade=t=in:st=0:d=1,fade=t=out:st=$($intro-0.6):d=0.6"
$out = Join-Path $work ("{0:D2}.mp4" -f $i); $i++
& ffmpeg -y -v error -loop 1 -framerate 30 -t $intro -i $p0 -filter_complex $f @enc $out; $segs += $out

# ----- 2. Photos with slow zoom (Ken Burns) -----
$half = [math]::Floor($photos.Count / 2)
$k = 0
foreach ($p in $photos) {
  $frames = [int]($photoDur * 30)
  $zoom = if ($k % 2 -eq 0) { "1+0.10*on/$frames" } else { "1.10-0.10*on/$frames" }   # alternate zoom in / out
  $f = (Frame $photoDur) + ",scale=2160:3840,zoompan=z='$zoom':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30" +
       ",fade=t=in:st=0:d=0.5:color=white,fade=t=out:st=$($photoDur-0.5):d=0.5:color=white"
  $out = Join-Path $work ("{0:D2}.mp4" -f $i); $i++
  & ffmpeg -y -v error -loop 1 -framerate 30 -t $photoDur -i $p.FullName -filter_complex $f @enc $out; $segs += $out
  Write-Host "  photo $($k+1)/$($photos.Count) done"
  $k++
  # put the video in the middle of the photos
  if ($k -eq $half -and $vidDur -gt 0) {
    $f = (Frame $vidDur) + ",fps=30,fade=t=in:st=0:d=0.5:color=white,fade=t=out:st=$($vidDur-0.5):d=0.5:color=white"
    $out = Join-Path $work ("{0:D2}.mp4" -f $i); $i++
    & ffmpeg -y -v error -t $vidDur -i $videos[0].FullName -filter_complex $f @enc $out; $segs += $out
    Write-Host "  video done"
  }
}

# ----- 3. Outro card (last photo) -----
$pl = $photos[-1].FullName
$f = (Frame $outro) + ",scale=2160:3840,zoompan=z='1+0.0008*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30" +
     ",drawbox=x=0:y=0:w=iw:h=ih:color=black@0.40:t=fill" +
     ",drawtext=fontfile='$font':text='Two years of pure joy':fontsize=72:fontcolor=white:x=(w-tw)/2:y=h*0.42:alpha='min(1,t/1.2)'" +
     ",drawtext=fontfile='$font':text='God bless you always':fontsize=64:fontcolor=0xFFE7A0:x=(w-tw)/2:y=h*0.50:alpha='min(1,max(0,(t-1)/1.2))'" +
     ",drawtext=fontfile='$font':text='$FromLine':fontsize=50:fontcolor=white@0.9:x=(w-tw)/2:y=h*0.58:alpha='min(1,max(0,(t-2)/1.2))'" +
     ",fade=t=in:st=0:d=0.6,fade=t=out:st=$($outro-1.2):d=1.2"
$out = Join-Path $work ("{0:D2}.mp4" -f $i); $i++
& ffmpeg -y -v error -loop 1 -framerate 30 -t $outro -i $pl -filter_complex $f @enc $out; $segs += $out

# ----- 4. Join segments -----
$list = Join-Path $work "list.txt"
($segs | ForEach-Object { "file '" + ($_ -replace "\\","/") + "'" }) | Set-Content -Encoding ascii $list
$joined = Join-Path $work "joined.mp4"
& ffmpeg -y -v error -f concat -safe 0 -i $list -c copy $joined

# ----- 5. Music (your music.mp3, or a generated soft divine pad) -----
$musicPath = Join-Path $Folder $Music
if (-not (Test-Path -LiteralPath $musicPath)) {
  Write-Host "No music.mp3 found - generating a soft, peaceful pad..."
  # gentle chord swells: C - Am - F - G, 4 s each, with echo for a temple-like ambience
  $c = "if(lt(mod(t,16),4),{0},if(lt(mod(t,16),8),{1},if(lt(mod(t,16),12),{2},{3})))"
  $f1 = $c -f "261.63","220.00","174.61","196.00"
  $f2 = $c -f "329.63","261.63","220.00","246.94"
  $f3 = $c -f "392.00","329.63","261.63","293.66"
  $f4 = $c -f "523.25","440.00","349.23","392.00"
  $env = "pow(sin(PI*mod(t,4)/4),1.5)"
  $expr = "$env*(0.10*sin(2*PI*($f1)*t)+0.07*sin(2*PI*($f2)*t)+0.06*sin(2*PI*($f3)*t)+0.03*sin(2*PI*($f4)*t)+0.03*sin(PI*($f1)*t))"
  $musicPath = Join-Path $work "pad.wav"
  & ffmpeg -y -v error -f lavfi -i "aevalsrc='$expr':s=44100:d=$($Total+2)" -af "aecho=0.8:0.85:300|700:0.35|0.25,lowpass=f=3000,volume=1.6" $musicPath
}

$final = Join-Path $Folder "Birthday_Status_1min.mp4"
& ffmpeg -y -v error -i $joined -stream_loop -1 -i $musicPath -map 0:v -map 1:a -t $Total `
  -af "afade=t=in:st=0:d=2,afade=t=out:st=$($Total-4):d=4" -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart $final

Write-Host ""
Write-Host "DONE!  ->  $final" -ForegroundColor Green
Start-Process $Folder
