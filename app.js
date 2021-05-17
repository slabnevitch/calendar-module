function horizontalCalendar(){
  const monthList = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  const activeDates = [new Date(2021, 4, 5), new Date(2021, 4, 25)];
  let monthsLengthsArr = [];//массив ширин месяцев в пикс
  const dayWidth = 57.14;//шририна ячейки одного дня в пикс.
  let daysArr = [];//массив месяцев, состоящий из массивов каждого отдельного месяца
  let fullYearArr = [];//массив всего года в днях (длина = 365)
  let monthCheckPoints = [];//массив границ месяцев в пикс.
  let daysContainer = document.querySelector('.container');//div со всеми днями года
  const currMonthDisplay = document.getElementById('cur-month');
  const currYearDisplay = document.getElementById('cur-year');
  const display = document.querySelector('#lengthdispl');
  let scrolling = false;
  let isPrevYearAdded = false;
  let isNextYearAdded = false;

  var lastSevenDays = [];

  creatDataForCalendar = () => {
    daysArr = []; //очищаем массив дней в месяцах
    for(var i=0; i<12; i++){
    daysArr.push(createCalendar(currentYear, i, activeDates)); //наполняем массив дней в месяцах новыми данными. Каждый эл-т. массива -- массив с днями месяца
    }
    
    daysArr.forEach((month) => {
      monthsLengthsArr.push(month.length * dayWidth);//наполняем массив ширинами всех месяцев в пикселях, исходя из заданной ширины ячейки одного дня
      month.forEach(day => {
        fullYearArr.push(day);
      });
    });
    
    monthsLengthsArr.reduce((sum, cur) =>{  
      var val = sum + cur;
      // console.log(val)
      monthCheckPoints.push(val)//наполняем массив границ, суммируя длины месяцев
      return val;
    }, 0);
    
    return fullYearArr;
  },
    
	createNewYear = () => {
		const newYear = [];
		daysArr = [];

		for(var i=0; i<12; i++){
		daysArr.push(createCalendar(currentYear, i, activeDates)); //наполняем текущий год месяцами. Каждый эл-т. массива -- массив с днями месяца
		}
		monthsLengthsArr = [];
		daysArr.forEach((month) => {
		      monthsLengthsArr.push(month.length * dayWidth);//наполняем массив ширинами всех месяцев в пикселях, исходя из заданной ширины ячейки одного дня
		      month.forEach(day => {
		      	newYear.push(day);
		      });
		  });
		monthCheckPoints = [];//очищаем массив массив границ
		monthsLengthsArr.reduce((sum, cur) =>{  
			var val = sum + cur;
		  // console.log(val)
		  monthCheckPoints.push(val)//наполняем массив границ данными нового года, суммируя длины месяцев
		  return val;
		}, 0);
		console.log('newYear.length in his own func:');
		console.log(newYear.length);
		return newYear;
	},
    
createCalendar = (year, month, activeDates) => {
    // console.log(year, month);
    var currentDate = new Date(year, month),//дата, переданная в ф-цию. при первом ее вызове или из формы при изменении
        nextDate = new Date(year, month + 1),// месяц, следующий за текущим
        currentDateDay = new Date(year, month, 1),//первое число текущего месяца
        periodMs = nextDate - currentDate,//разница в милисекундах м/у первыми числами текущего и следующего месяца
        days = parseInt(periodMs/(60*60*1000*24)),//количество дней в текущем месяце
        daysNames = ['ВC', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
        var n = currentDateDay.getDay() - 1,
        arr = [],
        startDay = currentDateDay.getDay(),
        options = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit', 
		minute: '2-digit'
	};

    for(var i = 0; i < days; i++){
    	var activeDate = false;
    	activeDates.forEach((day) => {
    		if(day.getDate() === i){
    			activeDate = true;
    		}
    	});
    	n++;
    	if(n > 6 ) n = 0;
  		// console.log("число " + (i+1) + "день недели " + n);
	const textDate = new Intl.DateTimeFormat('ru-RU', options).format(new Date(year, month, i+1));
      var cell = {
      	dayOfWeekInd: i + 1, 
      	dayName: daysNames[n], 
      	dayOfMonth: n,
      	isActiveDay: activeDate,
      	textDate
      };
      arr.push(cell);
   }

  return arr;
    // generateNet(arr[0].dayOfMonth, arr);

},
    
  removePrevYearWeekBackward = () => {
    console.log('removePrevYearWeekBackward');
    const deleteCount = fullYearArr.length > 365 ? 8 : 7;
    console.log('deleteCount '+ 8);
    [...daysContainer.childNodes].forEach((node, i) => {
      if(i > fullYearArr.length - 8){
        // console.log(i);
        node.remove();
      }
    });
    fullYearArr.splice(fullYearArr.length - 8, 8);
    isPrevYearAdded = false;
    console.log('isPrevYearAdded= ' + isPrevYearAdded);
  },
    
  removePrevYearWeekForward = () => {
    console.log('removePrevYearWeekForward');
    [...daysContainer.childNodes].forEach((node, i) => {
       
      if(i < 7){
        // console.log(i);
        node.remove();//удаляем из ХТМЛ все дни текущего года кроме последних 7-ми
      }
    });

    fullYearArr.splice(0, 7);
    isNextYearAdded = false;
    console.log('isNextYearAdded = ' + isNextYearAdded);
  },
  
  removeDaysOfNextYearFromEnd = (daysCount) => {
    //вызывается при движении НАЗАД
    
     [...daysContainer.childNodes].forEach((node, i) => {
       
      if(i > 7 && i < fullYearArr.length){
        // console.log(i);
        node.remove();//удаляем из ХТМЛ все дни текущего года кроме последних 7-ми
      }
    });
    fullYearArr.splice(7, fullYearArr.length)
  },
    
  removeDaysOfPrevYearFromEnd = () => {
    //вызывается при движении ВПЕРЕД
      
    [...daysContainer.childNodes].forEach((node, i) => {
       
      if(i < fullYearArr.length - 7){
        // console.log(i);
        node.remove();//удаляем из ХТМЛ все дни текущего года кроме последних 7-ми
      }
    });
  },
    
  daysPrepend = () => {
   
    createNewYear().reverse().forEach((el, i, arr) => {//рендерим массив нового года в ХТМЛ
         // if(i > daysArr.length - 1) return;
        var cell = document.createElement('div'),
        cellVal = document.createElement('div'),
        cellName = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-text', el.textDate);
        cellVal.className = 'cell__val';
        cellName.className = 'cell__name';

        cellVal.innerText = arr[i].dayOfWeekInd;
        cellName.innerText = arr[i].dayName;

        cell.append(cellName);
        cell.append(cellVal);
        daysContainer.prepend(cell);
    });
  },
    
  daysAppend = () => {
    console.log(createNewYear());
    createNewYear().forEach((el, i, arr) => {//рендерим массив нового года в ХТМЛ
        var cell = document.createElement('div'),
        cellVal = document.createElement('div'),
        cellName = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-text', el.textDate);
        cellVal.className = 'cell__val';
        cellName.className = 'cell__name';

        cellVal.innerText = arr[i].dayOfWeekInd;
        cellName.innerText = arr[i].dayName;

        cell.append(cellName);
        cell.append(cellVal);
        daysContainer.append(cell);
    });

    if(isPrevYearAdded){
    	[...daysContainer.childNodes].forEach((node, i) => {
    		if(i < 8){
    			node.remove();
    		}
    	});
   		lastSevenDays.reverse().forEach((el, i, arr) => {

	        var cell = document.createElement('div'),
	        cellVal = document.createElement('div'),
	        cellName = document.createElement('div');
	        cell.className = 'cell';
	        cell.setAttribute('data-text', el.textDate);
	        cellVal.className = 'cell__val';
	        cellName.className = 'cell__name';

	        cellVal.innerText = arr[i].dayOfWeekInd;
	        cellName.innerText = arr[i].dayName;

	        cell.append(cellName);
	        cell.append(cellVal);
	        daysContainer.prepend(cell);
    	});
    }

  },
    
  render = () => {
    if(daysContainer.childNodes.length > 0){

      while (daysContainer.firstChild) {
        daysContainer.removeChild(daysContainer.firstChild);
      }
    }
  
    fullYearArr.forEach((el, i) => {
         // if(i > daysArr.length - 1) return;
        var cell = document.createElement('div'),
        cellVal = document.createElement('div'),
        cellName = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-text', el.textDate);
        cellVal.className = 'cell__val';
        cellName.className = 'cell__name';

        cellVal.innerText = fullYearArr[i].dayOfWeekInd;
        cellName.innerText = fullYearArr[i].dayName;

        cell.append(cellName);
        cell.append(cellVal);
        daysContainer.append(cell);
    });
  },
    
  subscribeToScroll = (e) =>{
    scrolling = true;
  },
 
   scrollThrottling = () => {
     setInterval(() => {
      if(scrolling){
        scrolling = false;
        monthCheckPoints.forEach((point, i, arr) => {
      // let val = prev + curr;
      // console.log('arr[i] ' + arr[i]);
      // console.log('arr[i+1] ' + arr[i+1]);

        if(daysContainer.scrollLeft >= arr[i] && daysContainer.scrollLeft <= arr[i + 1]){
          // console.log('prev ' + arr[i]);
          currMonthDisplay.innerHTML = monthList[arr.indexOf(arr[i+1])];
        }
        if(daysContainer.scrollLeft < arr[0]){
          currMonthDisplay.innerHTML = monthList[0];
        }
        
       });
        
        if(daysContainer.scrollLeft > monthCheckPoints[monthCheckPoints.length - 1] - 50){
          currMonthDisplay.innerHTML = monthList[0];
        }
        
        if(daysContainer.scrollLeft < 10){
            currentMonth = 11;
            currentYear -= 1;

            currYearDisplay.innerText = currentYear;
            console.log('currentMonth ' + currentMonth);
            console.log('currentYear ' + currentYear);
            calendarBackwardCut();
         }
        if(daysContainer.scrollLeft + daysContainer.offsetWidth > daysContainer.scrollWidth - 10){
            currentMonth = 1;
            currentYear += 1;

            currYearDisplay.innerText = currentYear;
            console.log('currentMonth ' + currentMonth);
            console.log('currentYear ' + currentYear);
            calendarForwardCut();
         }
        
        if(daysContainer.scrollLeft < monthCheckPoints[10] && daysContainer.scrollLeft > monthCheckPoints[0] && isPrevYearAdded){
         removePrevYearWeekBackward(); 
        }
        
        if(daysContainer.scrollLeft > monthCheckPoints[0] && isNextYearAdded){
         removePrevYearWeekForward(); 
        }
      }
      
    }, 1000);
  },
  
  wrapperScroll = (scrolval) => {
   //ф-ция. для скролла клендаря к необходимой позиции
   daysContainer.scrollTo(scrolval, 0)
  },
   
   calendarBackwardCut = () => {
     let daysToRemoveCount = fullYearArr.length - 7;
     
     removeDaysOfNextYearFromEnd(daysToRemoveCount);//запускаем ф-цию. удаления из хтмл всех дней текущего года, кроме 1-х 8-ми дней января
     
     fullYearArr.splice(7, fullYearArr.length - 7);//удаляем из массива всех дней текущего года все дни, кроме 1-х 8-ми дней января
     calendarBackwardUnshift();//запускаем ф-цию. добавления в массив всех дней предыдущего года
     console.log('length' + fullYearArr.length);
   },
     
   calendarForwardCut = () => {
     removeDaysOfPrevYearFromEnd();
     if(!isPrevYearAdded){
     	fullYearArr.splice(0, fullYearArr.length - 7);//удаляем из массива всех дней текущего года все дни, кроме последних 8-ми дней декабря
     }else{
     	// fullYearArr.splice(0, fullYearArr.length - 7);
     	console.log('Последняя неделя года ВПЕРЕД:');
     	lastSevenDays = fullYearArr.slice(0, 7);
     	console.log(lastSevenDays);
     	fullYearArr.splice(0, fullYearArr.length - 7);
     }
     console.log('массив дней после удаления ВПЕРЕД '+ fullYearArr.length);
      calendarForwardPush();
   },
     
   calendarBackwardUnshift = () => {
     console.log(createNewYear());//массив всех дней предыдущего года
     createNewYear().forEach(item => {//создаем массив всех дней нового года и перебираем его
       fullYearArr.unshift(item);//добавляем дни предыдущего (при прокрутке назад) года к оставшейся неделе текущего
     });
     
     daysPrepend(); //вызов ф-ции. добавления дочерних узлов в начало контейнера
     isPrevYearAdded = true;

     console.log('isPrevYearAdded = ' + isPrevYearAdded);
     
     console.log('длина массива всех дней при добавлении предыдущего года НАЗАД ' + fullYearArr.length);
     console.log('длина всех детей календаря при добавлении предыдущего года НАЗАД ' + daysContainer.childNodes.length);
     
     wrapperScroll(monthCheckPoints[monthCheckPoints.length - 1] - 100);//при переходе к предыдущему году прокручиваем каледар на 100 пикс. назад, чтобы показать переход от янв. текущего года к декабрю предыдущего
   },

   calendarForwardPush = () => {
     console.log('массив дней после удаления Перед push() ВПЕРЕД '+ fullYearArr.length);
     console.log(fullYearArr);
     
     createNewYear().forEach(item => {//создаем массив всех дней нового года и перебираем его
       fullYearArr.push(item);//добавляем дни следующего (при прокрутке вперед) года к оставшейся неделе текущего
     });

     console.log('fullYearArr до добавления 25-31:');
     console.log(fullYearArr);

     if(isPrevYearAdded){
     	fullYearArr.splice(0, 7);
     	fullYearArr = [...lastSevenDays.reverse(), ...fullYearArr];
     }

     console.log('новый год вперед общее кол-во Если пришли с предыдущего месяца ДО удаления последней недели:');
     console.log(fullYearArr);

     daysAppend(); //вызов ф-ции. добавления дочерних узлов в начало контейнера

     isNextYearAdded = true;

     console.log('isNextYearAdded = ' + isNextYearAdded);
     console.log('!!isPrevYearAdded = ' + isPrevYearAdded);
     
     wrapperScroll(200);
     
     console.log('длина массива всех дней при добаалении СЛЕДУЮЩЕГО года ВПЕРЕД' + fullYearArr.length);
     console.log('длина всех детей календаря при добаалении СЛЕДУЮЩЕГО года ВПЕРЕД' + daysContainer.childNodes.length);
     console.log(fullYearArr);
   }
  
  return {
    init: (month = currentMonth) => {
      display.onclick = (e) => {
        e.target.innerText = fullYearArr.length;
      }
      daysContainer.addEventListener('scroll',subscribeToScroll );//добавление события скролла календарю
      scrollThrottling();//запуск ф-ции. задержки реакции на скролл
      creatDataForCalendar();//запуск ф-ции. формирования всех массивов для построения календаря
      currYearDisplay.innerText = currentYear;
      render();//рендер календаря в ХТМЛ
      
      console.log('summa ' + (daysContainer.scrollLeft + daysContainer.offsetWidth))
      console.log('daysContainer.scrollWidth  ' + daysContainer.scrollWidth )

      let scroll; //величина скролла к текущему месяцу
      if(month > 0 && month < 12){
        scroll = monthCheckPoints[month - 1]
      }
      if(month == 0){
        scroll = 3;
      }
      console.log(scroll + 3)
      wrapperScroll(scroll + 3)
    }
  }
}

horizontalCalendar().init(1)