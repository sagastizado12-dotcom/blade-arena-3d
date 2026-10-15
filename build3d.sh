#!/bin/sh
# Builds legacy-sim bundle for the 3D renderer: src/ modules (minus adult/flirt modules) + 3D bridge.
set -e
cd "$(dirname "$0")"
MODS=$(sed -n 's/.*cat \(src\/a_setup.js.*src\/z_boot.js\).*/\1/p' build.sh)
OUT=src3d/legacy/game3d.js
{ echo "(function(){"
for f in $MODS; do
  case "$f" in
    src/zu_sextag.js|src/yn_flirt.js) [ "$f" = src/yn_flirt.js ] && cat src3d/legacy/stubs_content.js ;;
    src/z_boot.js) cat src3d/legacy/zz3d_bridge.js; sed 's/if("serviceWorker" in navigator&&location.protocol!=="file:")/if(false)/' "$f" ;;
    src/g_loop.js) sed 's/^function draw(){/function draw(){if(window.__3D\&\&__d3hook())return;/' "$f" ;;
    src/yo_night.js) sed 's/if(!hero||!world||state!=="play")return;const dk=darkness();/if(!hero||!world||state!=="play")return;if(window.__3D\&\&!room)return;const dk=darkness();/' "$f" ;;
    src/zl_destruct.js) sed 's/ctx.setTransform(1,0,0,1,0,0);const CWd=/if(window.__3D){ctx.restore();return;}ctx.setTransform(1,0,0,1,0,0);const CWd=/' "$f" ;;
    src/yf_life.js) sed 's/for(const b of bubbles)if(!b.n.inside)bub(/for(const b of (window.__3D?[]:bubbles))if(!b.n.inside)bub(/' "$f" ;;
    *) cat "$f" ;;
  esac; echo
done
echo "})();"; } > $OUT
V=$(date +%s); sed -i "s/__BUILDV__/$V/g" $OUT
for p in '__d3hook())return' 'window.__3D&&!room)return' 'window.__3D){ctx.restore' 'window.__3D?\[\]:bubbles' 'if(false)'; do grep -q "$p" $OUT || { echo "PATCH MISSING: $p"; exit 1; }; done
! grep -q "FLIRT_ROUGH\|SEX_CSS" $OUT || { echo "adult module leaked"; exit 1; }
node --check $OUT && echo "built $OUT ($(wc -c <$OUT) bytes)"
