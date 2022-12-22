async function timeF1() {
  const start = performance.now();

  await maze.generatePrimMaze();

  const end = performance.now();
  //console.log(`Execution time: ${end - start} ms`);
  return end - start;
}
async function timeF2() {
  const start = performance.now();

  await maze.aStarSolve();

  const end = performance.now();
  //console.log(`Execution time: ${end - start} ms`);
  return end - start;
}
async function timeF3(s) {
  const start = performance.now();

  await createMaze(s);

  const end = performance.now();
  //console.log(`Execution time: ${end - start} ms`);
  return end - start;
}

async function single_test(s) {
  const t1 = await timeF3(s);
  const t2 = await timeF1();
  const t3 = await timeF2();
  if(s in times){
    const r = times[s]
    
    r.c.push(t1)
    r.g.push(t2)
    r.s.push(t3)
    
  }else{
    times[s] = {
      'c' : [t1],
      'g' : [t2],
      's' : [t3],
    }
  }
}
let times = {};
async function TIME_TEST(s, tc){
  for(let i = 10; i < s; i++){
    for(let q = 0; q < tc; q++){
      await single_test(i)
    }
    times[i].c = sum(times[i].c)/tc
    times[i].g = sum(times[i].g)/tc
    times[i].s = sum(times[i].s)/tc
  }
  console.log(JSON.stringify(times))
}
async function time(f) {
  const start = performance.now();

  for(let i = 0; i < 1000; i++){
    await f()
  }

  const end = performance.now();
  console.log(`Execution time: ${end - start} ms`);
  return end - start;
}