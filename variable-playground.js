var person = {

	name : 'Imran',
	age : 29
};

function updatePerson(obj){
	/*obj = {
		name : 'Imran',
		age : 20
	};*/

	obj.age = 22;
}

updatePerson(person);

console.log(person);