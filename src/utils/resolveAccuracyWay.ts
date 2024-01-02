

export function ResolveAccuracy ( description : string ) {
    if(description.includes('PLUM')) return "PLUM法による予測"
    else if(description.includes('IPF')) return "IPF法による予測"
    else if(description.includes('レベル')) return "レベル法による予測"
    else return description
}