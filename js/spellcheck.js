/**
 * spellcheck.js
 * Полная проверка орфографии и пунктуации (без regex)
 */

class SpellChecker {
    constructor() {
        // Словарь замен (частые ошибки)
        this.dictionary = {
            // Приветствия
            'превет': 'привет',
            'здрасти': 'здравствуйте',
            'здрасьте': 'здравствуйте',
            
            // Благодарности
            'спосибо': 'спасибо',
            'пажалуйста': 'пожалуйста',
            'пожалуста': 'пожалуйста',
            
            // Извинения
            'извиняюсь': 'извините',
            'извени': 'извини',
            'извените': 'извините',
            
            // Частотные слова
            'канешно': 'конечно',
            'конешно': 'конечно',
            'чета': 'что-то',
            'че': 'что',
            'щас': 'сейчас',
            'счас': 'сейчас',
            'седня': 'сегодня',
            'севодня': 'сегодня',
            'севoдня': 'сегодня',
            'завтро': 'завтра',
            'вчира': 'вчера',
            'весило': 'весело',
            'интиресно': 'интересно',
            'интересно': 'интересно',
            'весело': 'весело',
            'весило': 'весело',
            'вэсэло': 'весело',
            'интересно': 'интересно',
            'интиресно': 'интересно',
            'интэресно': 'интересно',
            'интирисно': 'интересно',
            
            // Школьные слова
            'учитиль': 'учитель',
            'учитиля': 'учителя',
            'учитилей': 'учителей',
            'ученик': 'ученик',
            'ученики': 'ученики',
            'учеников': 'учеников',
            'ученник': 'ученик',
            'ученники': 'ученики',
            'клас': 'класс',
            'класа': 'класса',
            'класу': 'классу',
            'класов': 'классов',
            'шола': 'школа',
            'шолу': 'школу',
            'шоле': 'школе',
            'шолы': 'школы',
            'грамата': 'грамота',
            'граматы': 'грамоты',
            'грамату': 'грамоту',
            'жури': 'жюри',
            
            // Глаголы
            'прошол': 'прошел',
            'прошёл': 'прошел',
            'пошол': 'пошел',
            'пошёл': 'пошел',
            'пришол': 'пришел',
            'пришёл': 'пришел',
            'нашол': 'нашел',
            'нашёл': 'нашел',
            'зашол': 'зашел',
            'зашёл': 'зашел',
            'вышол': 'вышел',
            'вышёл': 'вышел',
            
            // Прилагательные
            'хорошый': 'хороший',
            'плохый': 'плохой',
            'веселый': 'веселый',
            'весёлый': 'веселый',
            'красивый': 'красивый',
            'интересный': 'интересный',
            
            // Жи-ши, ча-ща, чу-щу
            'жы': 'жи',
            'шы': 'ши',
            'чя': 'ча',
            'щя': 'ща',
            'чю': 'чу',
            'щю': 'щу',
            
            // Другие частые ошибки
            'жюри': 'жюри',
            'руский': 'русский',
            'руская': 'русская',
            'руское': 'русское',
            'искусство': 'искусство',
            'исскуство': 'искусство'
        };

        // Слова для проверки окончаний
        this.pronouns = ['он', 'она', 'оно', 'они'];
    }

    /**
     * Главная функция проверки
     */
    checkText(text) {
        if (!text || text === '') {
            return '';
        }

        console.log('Исходный текст:', text);
        
        // Разбиваем на слова (сохраняя знаки препинания)
        let words = this.splitIntoWords(text);
        console.log('Разбитые слова:', words);
        
        // Проверяем каждое слово
        for (let i = 0; i < words.length; i++) {
            words[i] = this.checkWord(words[i], i, words);
        }
        
        // Собираем текст обратно
        let result = words.join('');
        console.log('После проверки слов:', result);
        
        // Исправляем пунктуацию
        result = this.fixPunctuation(result);
        console.log('После пунктуации:', result);
        
        // Исправляем заглавные буквы
        result = this.fixCapitalization(result);
        console.log('После заглавных:', result);
        
        // Исправляем пробелы
        result = this.fixSpaces(result);
        console.log('Финальный результат:', result);
        
        return result;
    }

    /**
     * Разбивает текст на слова и знаки препинания
     */
    splitIntoWords(text) {
        let words = [];
        let currentWord = '';
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (this.isLetter(char)) {
                currentWord += char;
            } else {
                if (currentWord !== '') {
                    words.push(currentWord);
                    currentWord = '';
                }
                words.push(char);
            }
        }
        
        if (currentWord !== '') {
            words.push(currentWord);
        }
        
        return words;
    }

    /**
     * Проверка отдельного слова
     */
    checkWord(word, index, allWords) {
        if (!this.isWord(word)) {
            return word;
        }
        
        let originalWord = word;
        let lowerWord = '';
        for (let i = 0; i < word.length; i++) {
            lowerWord += word[i].toLowerCase();
        }
        
        // Проверяем по словарю
        if (this.dictionary[lowerWord]) {
            let replacement = this.dictionary[lowerWord];
            
            // Сохраняем регистр первой буквы
            if (this.isCapitalized(word)) {
                replacement = this.capitalizeFirst(replacement);
            }
            
            console.log(`Замена: "${word}" -> "${replacement}"`);
            return replacement;
        }
        
        // Проверяем окончания -тся/-ться
        if (lowerWord.includes('ться') || lowerWord.includes('тся')) {
            return this.checkEndings(word, index, allWords);
        }
        
        // Проверяем жи-ши, ча-ща, чу-щу
        return this.fixCommonMistakes(word);
    }

    /**
     * Проверка окончаний
     */
    checkEndings(word, index, allWords) {
        // Проверяем предыдущее слово (местоимение)
        if (index > 0) {
            let prevWord = '';
            for (let i = 0; i < allWords[index - 1].length; i++) {
                prevWord += allWords[index - 1][i].toLowerCase();
            }
            
            let lowerWord = '';
            for (let i = 0; i < word.length; i++) {
                lowerWord += word[i].toLowerCase();
            }
            
            // он/она/оно + ться -> тся
            if ((prevWord === 'он' || prevWord === 'она' || prevWord === 'оно') && lowerWord.includes('ться')) {
                return word.replace('ться', 'тся');
            }
            
            // они + тся -> ются
            if (prevWord === 'они' && lowerWord.includes('тся')) {
                return word.replace('тся', 'ются');
            }
        }
        
        return word;
    }

    /**
     * Исправление частых ошибок в слове
     */
    fixCommonMistakes(word) {
        let result = '';
        let i = 0;
        
        while (i < word.length) {
            let char = word[i];
            let nextChar = i < word.length - 1 ? word[i + 1] : '';
            let nextNextChar = i < word.length - 2 ? word[i + 2] : '';
            
            // жы -> жи
            if (char === 'ж' && nextChar === 'ы') {
                result += 'жи';
                i += 2;
            }
            // шы -> ши
            else if (char === 'ш' && nextChar === 'ы') {
                result += 'ши';
                i += 2;
            }
            // чя -> ча
            else if (char === 'ч' && nextChar === 'я') {
                result += 'ча';
                i += 2;
            }
            // щя -> ща
            else if (char === 'щ' && nextChar === 'я') {
                result += 'ща';
                i += 2;
            }
            // чю -> чу
            else if (char === 'ч' && nextChar === 'ю') {
                result += 'чу';
                i += 2;
            }
            // щю -> щу
            else if (char === 'щ' && nextChar === 'ю') {
                result += 'щу';
                i += 2;
            }
            // чьк -> чк
            else if (char === 'ч' && nextChar === 'ь' && nextNextChar === 'к') {
                result += 'чк';
                i += 3;
            }
            // чьн -> чн
            else if (char === 'ч' && nextChar === 'ь' && nextNextChar === 'н') {
                result += 'чн';
                i += 3;
            }
            else {
                result += char;
                i++;
            }
        }
        
        return result;
    }

    /**
     * Исправление пунктуации
     */
    fixPunctuation(text) {
        let result = text;
        
        // Убираем пробелы перед знаками препинания
        result = result.replace(' .', '.');
        result = result.replace(' ,', ',');
        result = result.replace(' !', '!');
        result = result.replace(' ?', '?');
        result = result.replace(' :', ':');
        result = result.replace(' ;', ';');
        
        // Точка в конце
        if (result.length > 0) {
            let lastChar = result[result.length - 1];
            if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?' && lastChar !== ')' && lastChar !== '"') {
                result = result + '.';
            }
        }
        
        return result;
    }

    /**
     * Исправление заглавных букв
     */
    fixCapitalization(text) {
        let result = '';
        let newSentence = true;
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (this.isLetter(char)) {
                if (newSentence) {
                    result += char.toUpperCase();
                    newSentence = false;
                } else {
                    result += char.toLowerCase();
                }
            } else {
                result += char;
                if (char === '.' || char === '!' || char === '?') {
                    newSentence = true;
                }
            }
        }
        
        return result;
    }

    /**
     * Исправление пробелов
     */
    fixSpaces(text) {
        let result = '';
        let lastWasSpace = false;
        
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (char === ' ') {
                if (!lastWasSpace) {
                    result += ' ';
                    lastWasSpace = true;
                }
            } else {
                result += char;
                lastWasSpace = false;
            }
        }
        
        return result.trim();
    }

    /**
     * Проверка, является ли символ буквой
     */
    isLetter(char) {
        let code = char.charCodeAt(0);
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
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Полная проверка с отчетом
     */
    fullCheck(text) {
        let original = text;
        let corrected = this.checkText(text);
        
        return {
            original: original,
            corrected: corrected,
            hasChanges: original !== corrected
        };
    }
}

// Создаем глобальный экземпляр
const spellChecker = new SpellChecker();