//jshint esversion:6
module.exports.getdate=function (){
   let today =new Date();
   let options={
     weekday:'long',
     day:'numeric',
     month:'long',
   }
   let date=today.toLocaleDateString('en-US',options);
   return date;
}
module.exports.getday=function(){
  let today =new Date();
  let options={
    weekday:'long',
  }
  let date=today.toLocaleDateString('en-US',options);
  return date;
}