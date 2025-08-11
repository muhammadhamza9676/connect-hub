let arr = [1,2,3,[4,5],6,7]

function flattenArray(arr){
    let newArr = []
    for(let i=0; i<arr.length; i++){
        newArr += arr[i]
    }
    return newArr
}

let res = flattenArray(arr)
