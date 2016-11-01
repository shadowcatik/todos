'use strict';

//Обьявление переменных

var container = document.getElementById("container"),
    todoWrap = document.querySelector('.todo--wrap'),  
    todo = document.getElementById('todo'),
    form = document.querySelector('form'),
    todoFooter = document.querySelector('#todo-footer'),
    destroy = document.getElementsByClassName('destroy'),
    confirmNew = document.getElementById('add_list'),
    field = document.getElementById('new-item'),
    items = 0,
    sum = document.getElementById('sum'),
    checkbox = document.getElementById('checkbox');

//Добавление введенного текста при щелчке мышки за пределами формы

document.body.onmouseout = handler;

function handler(event) {
  if (event.type == 'mouseout') {
    document.addEventListener("click", function(event) {
      formEvent();
    }); 
  }; 
}

//Добавление введенного текста при нажатии кнопки Enter

function formEvent() {
  var text = field.value;
  if (text !== '') {
    todo.innerHTML += '<li class="todo-value">' + '<input class="todo--list__checkmark todo--list__checkbox" />' + '<span class="todo--list list--item">' + text + "</span>" + '<button class="destroy"></button>' + '</li>';
    ++window.items;
    addFooter();
    
    field.value = '';
    field.focus(); 
  }  
}

// обработчики
todo.addEventListener('click', function(event) {
  
  //Выделение списка
  var target = event.target;
  // возможно, клик был внутри списка UL, но вне элементов LI
  if (target.tagName != "INPUT") return;
   
  if (event)  toggleSelect(target);
    
});

todo.onmousedown = function() {
  return false;
};

// функции для выделения

function toggleSelect(input) {
  if (!input.classList.contains('selected'))
    --items;
  else
    ++items;
  sum.setAttribute('value', items);
  
  input.classList.toggle('selected');  
  input.nextSibling.classList.toggle('completed');
  
  sortGrid(todoFooter.querySelector('.select').dataset.type);
}

//Выделить все

checkbox.addEventListener ('click', function() {
  var liArray = todo.getElementsByTagName('li');
  var liArrayLength = liArray.length;
  var selected_count = 0;
  for (var i = 0; i < liArrayLength; i++) {
    if (!liArray[i].children[0].classList.contains('selected')){
      --items;
      liArray[i].children[0].classList.add('selected');
      liArray[i].children[1].classList.add('completed');
      selected_count++;
    }
  }
  if (!selected_count) {
    for (var i = 0; i < liArrayLength; i++) {
      ++items;
      liArray[i].children[0].classList.remove('selected');
      liArray[i].children[1].classList.remove('completed');
    }
  }
  
  sum.setAttribute('value', items);
});

//Удаление пункта списка

todo.addEventListener('click', function(){ 
  if (!event.target.classList.contains('destroy')) return;   
  event.target.parentNode.remove();

  --items;
  sum.setAttribute('value', items);  

  removeFooter();  
});

//Сортировка по активности

var footer = document.querySelector('#todo-footer');

footer.addEventListener('click', function(e) {
  sortGrid(e.target.getAttribute('data-type'));
});

function sortGrid(type) {
  switch (type) {
 
    //Удаление всех выделенных
      
    case 'clear-all':
      function removeAll() {
        var liArray = todo.getElementsByTagName('li');
        var liArrayLength = liArray.length;
        for (var i = 0; i < liArrayLength; i++) {
          if (liArray[i].children[0].classList.contains('selected')) {
            liArray[i].remove();
            liArrayLength = liArray.length;
            i--;
            window.items = 0;
          }
        }
      };
      removeAll();
      removeFooter();  
      break;
    
    //Сортировка по завершенным пунктам  
      
    case 'completed':
      function completedLi() {
        todoFooter.getElementsByClassName('sorting-item')[2].classList.add('select');
        todoFooter.getElementsByClassName('sorting-item')[0].classList.remove('select');
        todoFooter.getElementsByClassName('sorting-item')[1].classList.remove('select');

        var liArray = todo.getElementsByTagName('li');
        var liArrayLength = liArray.length;
        for (var i = 0; i < liArrayLength; i++) {
          if (!liArray[i].children[0].classList.contains('selected')) {
            liArray[i].hidden = true;
          }
          else {
            liArray[i].hidden = false;
          }
        }
      };
      completedLi();
      break;
    
    //Сортировка по активным пунктам
      
    case 'active':
      function activate() {
        todoFooter.getElementsByClassName('sorting-item')[1].classList.add('select');
        todoFooter.getElementsByClassName('sorting-item')[2].classList.remove('select');
        todoFooter.getElementsByClassName('sorting-item')[0].classList.remove('select');

        var liArray = todo.getElementsByTagName('li');
        var liArrayLength = liArray.length;
        for (var i = 0; i < liArrayLength; i++) {
          if (liArray[i].children[0].classList.contains('selected')) {
            liArray[i].hidden = true;
          }
          else {
            liArray[i].hidden = false;
          }
        }
      };
      activate();
      break;  
    
    case 'all':
      function showAll() {
        todoFooter.getElementsByClassName('sorting-item')[0].classList.add('select');
        todoFooter.getElementsByClassName('sorting-item')[2].classList.remove('select');
        todoFooter.getElementsByClassName('sorting-item')[1].classList.remove('select');

        var liArray = todo.getElementsByTagName('li');
        var liArrayLength = liArray.length;
        for (var i = 0; i < liArrayLength; i++) {
          liArray[i].hidden = false;
        }
      };
      showAll();
      break;  
  }
}

//Добавление Footer при наличии li

function addFooter() {
  todoFooter.style.display = 'flex';
  checkbox.style.display = 'block';
  sum.setAttribute('value', items);
  todoWrap.appendChild(todoFooter);
}

//Удаление Footer при отсутствии li

function removeFooter() {
  var liArray = todo.getElementsByTagName('li');
  if (liArray.length == 0) {
    todoFooter.style.display = '';
    checkbox.style.display = '';
  }
}