// Helper Functions

export function updateTimer(start){
    const diffMs = new Date() - start;
    const diffSec = Math.floor(diffMs/1000)
    // console.log(diffSec)
    return diffSec;
}