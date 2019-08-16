// Allows us to program using an API in an asynchronous manner
// Introduced in ES-8
async function myFunction(){
    // await
}

const myFunction = async () => {
    // await        (!) - async goes before the () in fat arrow
}

// You'll throw an error if you try to use await inside of a function that has async in front of function name

// Differences in async functions
// -- always returns a promise

async function fn(){
    return "Hello!";
}

fn().then(console.log);

async function foo(){
    throw Error("I pity you, foo!");
}

//foo().then(console.log); - throws an error
foo().catch(console.log);

// normal fetch to an API with some promise resolvers
fetch ()
    .then(response => response.json())
    .then(json => console.log(json))
    .then(error => console.log(error));

// wait makes asynchronous programming, synchronous

const request = async () => {
    const response = await fetch("https://random.dog/woof.json");
    const json = await response.json();
    console.log(json);
}

request();