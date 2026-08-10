#!/data/data/com.termux/files/usr/bin/bash

URL="$1"

am start \
-a android.intent.action.VIEW \
-d "$URL"
