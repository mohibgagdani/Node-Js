const conditions = ["sunny", "rainy", "thunderStorm", "foggy"];

function giveWether() {
  const greet = conditions[Math.floor(Math.random() * 4)];
  console.log(greet);
}



module.exports={giveWether}