/**
 * text-enhancer.js
 * Улучшение текста: синонимы, замена слов, обогащение лексики
 */

class TextEnhancer {
    constructor() {
        // Словарь синонимов (простой -> красивый/интересный)
        this.synonyms = {
            // Прилагательные
            'хороший': ['отличный', 'прекрасный', 'замечательный', 'чудесный', 'великолепный'],
            'плохой': ['неудачный', 'скверный', 'ужасный', 'кошмарный'],
            'большой': ['огромный', 'грандиозный', 'колоссальный', 'гигантский'],
            'маленький': ['небольшой', 'крошечный', 'миниатюрный', 'малюсенький'],
            'красивый': ['прекрасный', 'великолепный', 'восхитительный', 'очаровательный'],
            'интересный': ['увлекательный', 'захватывающий', 'занимательный', 'любопытный'],
            'веселый': ['радостный', 'жизнерадостный', 'заводной', 'оживленный'],
            'грустный': ['печальный', 'унылый', 'тоскливый', 'меланхоличный'],
            'сильный': ['могучий', 'мощный', 'непобедимый', 'крепкий'],
            'слабый': ['хилый', 'немощный', 'бессильный', 'нежный'],
            
            // Глаголы
            'говорить': ['рассказывать', 'вещать', 'произносить', 'выступать'],
            'сказал': ['произнес', 'вымолвил', 'проговорил', 'ответил'],
            'делать': ['выполнять', 'совершать', 'заниматься', 'трудиться'],
            'сделал': ['выполнил', 'совершил', 'осуществил', 'смастерил'],
            'идти': ['шагать', 'шествовать', 'двигаться', 'направляться'],
            'бежать': ['мчаться', 'нестись', 'лететь', 'спешить'],
            'смотреть': ['глядеть', 'наблюдать', 'лицезреть', 'рассматривать'],
            'видеть': ['замечать', 'наблюдать', 'различать', 'усматривать'],
            'думать': ['размышлять', 'мыслить', 'полагать', 'считать'],
            'понимать': ['осознавать', 'постигать', 'вникать', 'схватывать'],
            
            // Существительные
            'школа': ['альма-матер', 'храм наук', 'учебное заведение', 'гимназия'],
            'ученик': ['школьник', 'учащийся', 'воспитанник', 'студент'],
            'учитель': ['педагог', 'преподаватель', 'наставник', 'воспитатель'],
            'урок': ['занятие', 'лекция', 'классный час', 'занятие'],
            'класс': ['аудитория', 'кабинет', 'группа', 'коллектив'],
            'праздник': ['торжество', 'фестиваль', 'событие', 'мероприятие'],
            'концерт': ['выступление', 'представление', 'программа', 'фестиваль'],
            'конкурс': ['соревнование', 'турнир', 'состязание', 'олимпиада'],
            
            // Наречия
            'хорошо': ['отлично', 'прекрасно', 'замечательно', 'великолепно'],
            'плохо': ['ужасно', 'кошмарно', 'скверно', 'неудовлетворительно'],
            'быстро': ['стремительно', 'мгновенно', 'моментально', 'проворно'],
            'медленно': ['неспешно', 'неторопливо', 'плавно', 'лениво'],
            'много': ['немало', 'несчетно', 'бесчисленно', 'полным-полно'],
            'мало': ['недостаточно', 'капля', 'чуть-чуть', 'немного']
        };

        // Слова для замены на более научные/деловые
        this.formalWords = {
            'сделать': 'осуществить',
            'получить': 'приобрести',
            'дать': 'предоставить',
            'помочь': 'оказать содействие',
            'мешать': 'препятствовать',
            'начать': 'приступить',
            'кончить': 'завершить',
            'спросить': 'поинтересоваться',
            'ответить': 'отреагировать',
            'хотеть': 'желать',
            'мочь': 'иметь возможность',
            'надо': 'необходимо',
            'важно': 'существенно',
            'можно': 'разрешено'
        };

        // Слова для замены на более поэтические
        this.poeticWords = {
            'глаза': 'очи',
            'лицо': 'лик',
            'рот': 'уста',
            'руки': 'длани',
            'палец': 'перст',
            'лоб': 'чело',
            'щеки': 'ланиты',
            'шея': 'выя',
            'грудь': 'перси',
            'красота': 'лепота',
            'утро': 'утренее',
            'вечер': 'вечернее',
            'звезда': 'звездочка',
            'луна': 'луна-красавица'
        };

        // Типы улучшений
        this.enhancementTypes = {
            'synonym': 'synonym',        // синонимы
            'formal': 'formal',           // официально-деловой
            'poetic': 'poetic',           // поэтический
            'academic': 'academic',       // научный
            'simplify': 'simplify'        // упрощение
        };
    }

    /**
     * Главная функция улучшения текста
     * @param {string} text - исходный текст
     * @param {string} type - тип улучшения (synonym, formal, poetic, simplify)
     * @param {number} intensity - интенсивность (0.1 - 1.0)
     */
    enhanceText(text, type = 'synonym', intensity = 0.5) {
        if (!text || text === '') {
            return '';
        }

        console.log(`Улучшаем текст: тип=${type}, интенсивность=${intensity}`);

        // Разбиваем на слова (сохраняя знаки препинания)
        let words = this.splitIntoWords(text);
        
        // Определяем, сколько слов заменять (intensity)
        let wordsToReplace = Math.floor(words.length * intensity);
        let replacedCount = 0;

        // Проходим по словам
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            
            // Пропускаем не-слова (знаки препинания)
            if (!this.isWord(word)) continue;
            
            // Очищаем слово от знаков препинания
            let cleanWord = this.cleanWord(word);
            let lowerWord = cleanWord.toLowerCase();
            
            // Проверяем, нужно ли заменить это слово
            if (Math.random() < intensity && replacedCount < wordsToReplace) {
                let replacement = null;
                
                // Выбираем тип замены
                switch(type) {
                    case 'formal':
                        replacement = this.getFormalReplacement(lowerWord);
                        break;
                    case 'poetic':
                        replacement = this.getPoeticReplacement(lowerWord);
                        break;
                    case 'academic':
                        replacement = this.getAcademicReplacement(lowerWord);
                        break;
                    case 'simplify':
                        replacement = this.getSimpleReplacement(lowerWord);
                        break;
                    case 'synonym':
                    default:
                        replacement = this.getSynonymReplacement(lowerWord);
                        break;
                }
                
                // Если нашли замену
                if (replacement) {
                    // Сохраняем регистр первой буквы
                    if (this.isCapitalized(word)) {
                        replacement = this.capitalizeFirst(replacement);
                    }
                    
                    // Сохраняем знаки препинания
                    let punctuation = '';
                    for (let j = cleanWord.length; j < word.length; j++) {
                        punctuation += word[j];
                    }
                    
                    words[i] = replacement + punctuation;
                    replacedCount++;
                }
            }
        }

        return words.join('');
    }

    /**
     * Получить синоним
     */
    getSynonymReplacement(word) {
        if (this.synonyms[word]) {
            let synonyms = this.synonyms[word];
            let randomIndex = Math.floor(Math.random() * synonyms.length);
            return synonyms[randomIndex];
        }
        return null;
    }

    /**
     * Получить официальную замену
     */
    getFormalReplacement(word) {
        if (this.formalWords[word]) {
            return this.formalWords[word];
        }
        
        // Если нет в формальных, пробуем синонимы
        return this.getSynonymReplacement(word);
    }

    /**
     * Получить поэтическую замену
     */
    getPoeticReplacement(word) {
        if (this.poeticWords[word]) {
            return this.poeticWords[word];
        }
        
        // Если нет в поэтических, пробуем синонимы
        return this.getSynonymReplacement(word);
    }

    /**
     * Получить научную замену
     */
    getAcademicReplacement(word) {
        // Для научного стиля используем более сложные синонимы
        let academicMap = {
            'учить': 'изучать',
            'узнать': 'выяснить',
            'показать': 'продемонстрировать',
            'думать': 'полагать',
            'считать': 'полагать',
            'главный': 'основной',
            'важный': 'существенный',
            'разный': 'различный',
            'похожий': 'аналогичный',
            'конец': 'завершение',
            'начало': 'инициация'
        };
        
        if (academicMap[word]) {
            return academicMap[word];
        }
        
        return this.getSynonymReplacement(word);
    }

    /**
     * Получить упрощенную замену (для сложных слов)
     */
    getSimpleReplacement(word) {
        let simpleMap = {
            'осуществить': 'сделать',
            'приобрести': 'получить',
            'предоставить': 'дать',
            'препятствовать': 'мешать',
            'приступить': 'начать',
            'завершить': 'кончить',
            'поинтересоваться': 'спросить',
            'отреагировать': 'ответить',
            'желать': 'хотеть',
            'иметь возможность': 'мочь',
            'необходимо': 'надо',
            'существенно': 'важно',
            'разрешено': 'можно'
        };
        
        if (simpleMap[word]) {
            return simpleMap[word];
        }
        
        return null;
    }

    /**
     * Разбить текст на слова и знаки препинания
     */
    splitIntoWords(text) {
        let words = [];
        let current = '';
        
        for (let i = 0; i < text.length; i++) {
            let c = text[i];
            if (this.isLetter(c)) {
                current += c;
            } else {
                if (current !== '') {
                    words.push(current);
                    current = '';
                }
                words.push(c);
            }
        }
        
        if (current !== '') {
            words.push(current);
        }
        
        return words;
    }

    /**
     * Очистить слово от знаков препинания
     */
    cleanWord(word) {
        let clean = '';
        for (let i = 0; i < word.length; i++) {
            if (this.isLetter(word[i])) {
                clean += word[i];
            }
        }
        return clean;
    }

    /**
     * Проверка, является ли символ буквой
     */
    isLetter(c) {
        let code = c.charCodeAt(0);
        // Русские буквы
        if (code >= 1040 && code <= 1103) return true;
        // Английские буквы
        if (code >= 65 && code <= 90) return true;
        if (code >= 97 && code <= 122) return true;
        // Ё и ё
        if (code === 1025 || code === 1105) return true;
        return false;
    }

    /**
     * Проверка, является ли строка словом
     */
    isWord(str) {
        if (str.length === 0) return false;
        return this.isLetter(str[0]);
    }

    /**
     * Проверка на заглавную букву
     */
    isCapitalized(word) {
        if (word.length === 0) return false;
        return this.isLetter(word[0]) && word[0] === word[0].toUpperCase();
    }

    /**
     * Сделать первую букву заглавной
     */
    capitalizeFirst(str) {
        if (str.length === 0) return str;
        return str[0].toUpperCase() + str.slice(1);
    }

    /**
     * Улучшить весь текст (много проходов)
     */
    enhanceTextFull(text, intensity = 0.3) {
        if (!text || text === '') {
            return '';
        }

        let result = text;
        
        // Проходим разными типами улучшений
        result = this.enhanceText(result, 'synonym', intensity);
        result = this.enhanceText(result, 'formal', intensity * 0.5);
        
        return result;
    }
}

// Создаем глобальный экземпляр
const textEnhancer = new TextEnhancer();