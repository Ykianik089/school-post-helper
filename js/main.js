/**
 * main.js
 * Основная логика приложения
 */

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const processButton = document.getElementById('process-button');
    const copyButton = document.getElementById('copy-button');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const resultOutput = document.getElementById('result-output');
    const buttonText = processButton.querySelector('.button-text');
    const loader = processButton.querySelector('.loader');
    
    // Элементы для хэштегов
    const hashtagPanel = document.getElementById('hashtag-panel');
    const hashtagInput = document.getElementById('hashtag-input');
    const addHashtagBtn = document.getElementById('add-hashtag-btn');
    const hashtagList = document.getElementById('hashtag-list');
    const resetHashtagsBtn = document.getElementById('reset-hashtags-btn');
    
    // Функции-чекбоксы
    const funcParagraphs = document.getElementById('func-paragraphs');
    const funcFormatting = document.getElementById('func-formatting');
    const funcEmojis = document.getElementById('func-emojis');
    const funcHashtags = document.getElementById('func-hashtags');
    const funcSpellcheck = document.getElementById('func-spellcheck');
    const funcCapitalize = document.getElementById('func-capitalize');
    
    // Инициализация отображения хэштегов
    updateHashtagDisplay();
    
    // Обработка кнопки "Добавить хэштег"
    if (addHashtagBtn) {
        addHashtagBtn.addEventListener('click', function() {
            if (hashtagInput && hashtagInput.value.trim() !== '') {
                hashtagManager.addTag(hashtagInput.value);
                hashtagInput.value = '';
                updateHashtagDisplay();
            }
        });
    }
    
    // Обработка нажатия Enter в поле ввода
    if (hashtagInput) {
        hashtagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (hashtagInput.value.trim() !== '') {
                    hashtagManager.addTag(hashtagInput.value);
                    hashtagInput.value = '';
                    updateHashtagDisplay();
                }
            }
        });
    }
    
    // Кнопка сброса хэштегов
    if (resetHashtagsBtn) {
        resetHashtagsBtn.addEventListener('click', function() {
            hashtagManager.resetToDefault();
            updateHashtagDisplay();
        });
    }
    
    // Функция обновления отображения хэштегов
    function updateHashtagDisplay() {
        if (!hashtagList) return;
        
        let tags = hashtagManager.getAllTags();
        hashtagList.innerHTML = '';
        
        if (tags.length === 0) {
            let emptyItem = document.createElement('span');
            emptyItem.className = 'hashtag-empty';
            emptyItem.textContent = 'Нет хэштегов';
            hashtagList.appendChild(emptyItem);
            return;
        }
        
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            
            let tagItem = document.createElement('span');
            tagItem.className = 'hashtag-item';
            tagItem.innerHTML = `
                <span class="hashtag-name">${tag}</span>
                <span class="hashtag-remove" data-index="${i}">✕</span>
            `;
            
            hashtagList.appendChild(tagItem);
            
            // Добавляем обработчик удаления
            let removeBtn = tagItem.querySelector('.hashtag-remove');
            removeBtn.addEventListener('click', function() {
                let index = parseInt(this.getAttribute('data-index'));
                hashtagManager.removeTagByIndex(index);
                updateHashtagDisplay();
            });
        }
    }
    
    // Обработка кнопки "Начать обработку"
    processButton.addEventListener('click', function() {
        // Получаем текст
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!content) {
            alert('Пожалуйста, введите текст для обработки');
            return;
        }
        
        // Автоматически добавляем хэштеги из текста (если включена функция)
        if (funcHashtags.checked) {
            hashtagManager.addAutoTags(content);
            updateHashtagDisplay();
        }
        
        // Показываем анимацию загрузки
        processButton.disabled = true;
        buttonText.textContent = 'Обработка...';
        loader.classList.remove('hidden');
        
        // Имитация работы ИИ (3 секунды)
        setTimeout(function() {
            // Вызываем функцию обработки текста
            const processedText = processText(title, content);
            
            // Выводим результат
            resultOutput.innerHTML = processedText.replace(/\n/g, '<br>');
            
            // Активируем кнопку копирования
            copyButton.disabled = false;
            
            // Убираем анимацию
            processButton.disabled = false;
            buttonText.textContent = 'Начать обработку текста';
            loader.classList.add('hidden');
        }, 3000);
    });
    
    // Функция обработки текста
    function processText(title, content) {
        let result = '';
        
        // Добавляем заголовок, если он есть
        if (title) {
            if (funcEmojis.checked) {
                result += '📌 ' + title + '\n\n';
            } else {
                result += title + '\n\n';
            }
        }
        
        // Начинаем с исходного текста
        let processedContent = content;
        
        // ПРОВЕРКА ОРФОГРАФИИ
        if (funcSpellcheck.checked) {
            console.log('Проверяем орфографию...');
            let checkResult = spellChecker.fullCheck(processedContent);
            processedContent = checkResult.corrected;
        }

        // УЛУЧШЕНИЕ ТЕКСТА (КРАСИВЫЕ СИНОНИМЫ)
        if (document.getElementById('func-enhance') && 
            document.getElementById('func-enhance').checked) {
            if (typeof textEnhancer !== 'undefined' && textEnhancer) {
                processedContent = textEnhancer.enhanceText(processedContent, 0.4);
            }
        }
        
        // РАЗБИВКА НА АБЗАЦЫ
        if (funcParagraphs.checked) {
            if (window.textFormatter) {
                processedContent = textFormatter.formatText(processedContent);
            }
        }
        
        // ДОБАВЛЕНИЕ ЭМОДЗИ
        if (funcEmojis.checked) {
            // Проверяем, что словарь существует
            if (typeof emojiDict !== 'undefined' && emojiDict) {
                console.log('Добавляем эмодзи через словарь');
                console.log('Текст ДО:', processedContent);
                processedContent = emojiDict.addEmojisToParagraphs(processedContent);
                console.log('Текст ПОСЛЕ:', processedContent);
            } else {
                console.log('Словарь эмодзи не найден, используем заглушку');
                // Заглушка, если словарь эмодзи еще не подключен
                let paragraphs = processedContent.split('\n\n');
                let newParagraphs = [];
                for (let p of paragraphs) {
                    if (p.trim()) {
                        newParagraphs.push('🔹 ' + p);
                    }
                }
                processedContent = newParagraphs.join('\n\n');
            }
        }
        
        // ДОБАВЛЕНИЕ ХЕШТЕГОВ
        if (funcHashtags.checked) {
            let tagsString = hashtagManager.getTagsString();
            if (tagsString) {
                processedContent = processedContent + '\n\n' + tagsString;
            }
        }
        
        result += processedContent;
        
        return result;
    }
    
    // Кнопка копирования
    copyButton.addEventListener('click', function() {
        // Получаем текст без HTML-тегов
        const resultText = resultOutput.innerText || resultOutput.textContent;
        
        // Создаем временный элемент
        const textarea = document.createElement('textarea');
        textarea.value = resultText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Визуальный фидбек
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<span class="copy-icon">✅</span> Скопировано!';
        setTimeout(function() {
            copyButton.innerHTML = originalText;
        }, 2000);
    });
});