// Challenge 1: Sum of two numbers
const addition =(num1,num2)=>{
    return sum = num1+num2;  
}
console.log(addition(4,2))

// Challenge 2:Convert Minutes into Seconds
const Convert= (minutes)=>minutes*60;
console.log(Convert(5))


// Challenge 3: Perimeter of a Rectangle
const perimeter = (length,width)=>{
    return 2*(length+width)
}
console.log(perimeter(10,5))
console.log(perimeter(20,20))


// Challenge 4:Check Negative
const isNegative=(Number)=>{
    if (Number<0){
        console.log("true")
    }
    else{
        console.log("false")
    }
}
isNegative(-23)
isNegative(50)


// Challenge 5:Can I Drive
function CanDrive(name,age){
    if(age>=18)
        console.log (`${name}  is old enough to drive.`)
    else{
        console.log(`${name} is not old enough to drive yet.`)
    }
}
CanDrive("Tasha",12)
CanDrive("Anto",23)