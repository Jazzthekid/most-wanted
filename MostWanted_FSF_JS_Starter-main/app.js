
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (!searchResults) {
        alert('No one was found in the search.');
    }
    else if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
}
 

function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    if (searchTypeChoice) {
        let results = [];
        switch (searchTypeChoice) {
            case 'id':
                results = searchById(people);
                break;
            case 'name':
                results = searchByName(people);
                break;
            case 'traits':
                results = searchByTraits(people);
                break;
            default:
                return searchPeopleDataSet(people);
        }

        return results;
    } else {
        alert('No valid search type choice entered. Please try again.');
        return searchPeopleDataSet(people);
    }
}



function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function searchByTraits(people) {
    let traitToSearchFor = validatedPrompt('Please enter the trait you would like to search by.', ['gender','dob','height','weight','eyeColor','occupation']);
    switch (traitToSearchFor) {
        case "gender":
        let genderSearch = findGender(people);
        return genderSearch
        
        case "dob": 
        let dobSearch = findDob(people);
        return dobSearch
       
        case "height":
            let heightSearch = findHeight(people);
            return heightSearch
          
        case "weight":
            let weightSearch = findWeight(people);
            return weightSearch
        
        case "eyecolor":
            let eyeColor = findEyeColor(people);
            return eyeColor

        case "occupation":
            let occupationSearch = findOccupation(people);
            return occupationSearch
        
        default:
            break;
    }
}
    

function findGender(people){
    let userInput = validatedPrompt ('Would you like to search by male or female?', ['male','female']);
    let results = people.filter(function (el) {
        if (el.gender === (userInput)) {
            return true;
        }
    });
  
 return results;
 }

function findDob(people){
    let userInput = prompt('What date of birth would you like to search by?')
    let results = people.filter(function (el){
        if (el.dob === userInput){
            return true;
        }
    });
return results;
}

function findHeight(people){
    let userInput = prompt('What height would you like to search for?')
    let heightToSeaarchForInt = parseInt(userInput)
    let results = people.filter(function (el){
        if (el.height === heightToSeaarchForInt) {
            return true;
        }
    });
    return results
}

function findWeight(people){
    let userInput = prompt('What weight would you like to search for?')
    let weightToSearchForInt = parseInt(userInput)
    let results = people.filter(function (el){
        if (el.weight === weightToSearchForInt){
            return true;
        }
    });
    return results
}

function findEyeColor(people){
    let userInput = prompt('What eye color would you like to search by')
    let results = people.filter(function (el){
        if (el.eyeColor === userInput){
            return true;
        }
    });
    return results
}

function findOccupation(people){
    let userInput = prompt('What occupation would you like to search by')
    let results = people.filter(function(el){
        if (el.occupation === userInput){
            return true;
        }

    });
    return results
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            displayPersonInfo(person);
            break;
        case "family":
            let personFamily = findPersonFamily(person, people);
            displayPeople('Family', personFamily);
            break;
        case "descendants":
          let personDescendants = findPersonDescendants(person, people);
            displayPeople('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPersonInfo(person){
    let personInfo = `ID: ${person.id}\n` +
    `First Name: ${person.firstName}\n` +
    `Last Name: ${person.lastName}\n` +
    `Gender: ${person.gender}\n` +
    `Date of Birth: ${person.dob}\n` +
    `Height: ${person.height}\n` +
    `Weight: ${person.weight}\n` +
    `Eye Color: ${person.eyeColor}\n` +
    `Occupation: ${person.occupation}\n` +
    `Parents: ${person.parents.join(", ") || "Unknown"}\n` +
    `Current Spouse: ${person.currentSpouse || "None"}`;
    
    alert(personInfo);

}
function findPersonFamily(person, people) {
    const familyMembers = [];
  

    if (person.currentSpouse) {
      const spouse = people.find(p => p.id === person.currentSpouse);
      if (spouse) {
        familyMembers.push({ name: `${spouse.firstName} ${spouse.lastName}`, relation: "Spouse" });
      }
    }
  

    for (const parentId of person.parents) {
      const parent = people.find(p => p.id === parentId);
      if (parent) {
        familyMembers.push({ name: `${parent.firstName} ${parent.lastName}`, relation: "Parent" });
      }
    }
  

    const siblings = people.filter(p => p.parents.some(parentId => parentId === person.id));
    for (const sibling of siblings) {
      familyMembers.push({ name: `${sibling.firstName} ${sibling.lastName}`, relation: "Sibling" });
    }
  
    return familyMembers;
  };

 function findPersonDescendants(person, people) {
    const descendants = [];
  
    const children = people.filter(p => p.parents.includes(person.id));
    for (const child of children) {
      descendants.push({ name: `${child.firstName} ${child.lastName}` });
      descendants.push(...findPersonDescendants(child, people));
    }
  
    return descendants;
  };

  function findPersonDescendants(person, people) {
    const descendants = [];
  
    const children = people.filter(p => p.parents.includes(person.id));
    for (const child of children) {
      descendants.push({ name: `${child.firstName} ${child.lastName}` });
      descendants.push(...findPersonDescendants(child, people));
    }
  
    return descendants;
  };
  
  
function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}