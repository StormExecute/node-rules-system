const test = process.binding("v8");

if(!isReturnProxy(test)) {

	process.thenTest("must be blocked!");

} else {

	process.thenTest(true);

}