date=$(date '+%Y%m%d_%T' | tr -d :)
7zz a ./release/$date.zip  \
fanbox-downloader.js manifest.json settings.* LICENSE event_page.js icon_*.png