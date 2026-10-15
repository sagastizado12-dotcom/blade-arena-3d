// ===== 3D build: adult/flirt modules removed (zu_sextag, yn_flirt). Minimal stubs so other systems keep working. =====
const isFlirty=()=>false;let flirtFx=[];
function sexOf(n){if(!n)return null;if(n.sex)return n.sex;try{return isWoman(n)?"F":"M";}catch(_){return null;}}
function assignSexes(){}
