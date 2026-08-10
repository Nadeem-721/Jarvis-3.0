#!/data/data/com.termux/files/usr/bin/bash

QUERY="$*"

if [ -z "$QUERY" ]; then
    termux-open-url "https://www.youtube.com"
else
    ENCODED_QUERY=$(printf '%s' "$QUERY" | sed 's/ /+/g')
    termux-open-url "https://www.youtube.com/results?search_query=$ENCODED_QUERY"
fi
