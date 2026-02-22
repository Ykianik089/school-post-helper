/**
 * text-formatter.js
 * Умное форматирование текста и разбивка на абзацы
 */

// Класс для форматирования текста
class TextFormatter {
    constructor() {
        // Минимальное количество предложений в абзаце
        this.minSentencesPerParagraph = 2;
        // Максимальное количество предложений в абзаце
        this.maxSentencesPerParagraph = 4;
    }

    /**
     * Главная функция форматирования
     */
    formatText(text) {
        if (!text || text.trim() === '') {
            return '';
        }

        // Очищаем текст от лишних пробелов
        let cleanText = this.cleanText(text);
        
        // Разбиваем на предложения
        let sentences = this.splitIntoSentences(cleanText);
        
        if (sentences.length <= this.minSentencesPerParagraph) {
            // Если предложений мало - просто один абзац
            return sentences.join(' ');
        }

        // Группируем предложения в абзацы
        let paragraphs = this.groupSentences(sentences);
        
        // Склеиваем с двойным переносом строки
        return paragraphs.join('\n\n');
    }

    /**
     * Очистка текста от лишних пробелов
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')                    // множественные пробелы -> один
            .replace(/\n\s*\n/g, '\n')                // пустые строки -> одна
            .replace(/^\s+|\s+$/g, '')                // обрезаем края
            .replace(/([.!?])\s*(?=[A-ZА-Я])/g, '$1\n'); // метка для новых предложений
    }

    /**
     * Разбивка текста на предложения
     * Учитывает точки, восклицательные и вопросительные знаки
     */
    splitIntoSentences(text) {
        // Регулярное выражение для поиска границ предложений
        // Работает с русским и английским текстом
        let sentenceRegex = /[^.!?]+[.!?]+/g;
        let matches = text.match(sentenceRegex);
        
        if (!matches) {
            // Если не нашлось предложений, возвращаем весь текст
            return [text];
        }

        // Очищаем каждое предложение
        return matches.map(s => s.trim()).filter(s => s.length > 0);
    }

    /**
     * Умная группировка предложений в абзацы
     */
    groupSentences(sentences) {
        let paragraphs = [];
        let currentParagraph = [];
        
        for (let i = 0; i < sentences.length; i++) {
            let sentence = sentences[i];
            
            // Анализируем текущее предложение
            let sentenceInfo = this.analyzeSentence(sentence);
            
            // Проверяем, нужно ли начать новый абзац
            if (this.shouldStartNewParagraph(currentParagraph, sentenceInfo, i, sentences.length)) {
                if (currentParagraph.length > 0) {
                    paragraphs.push(currentParagraph.join(' '));
                    currentParagraph = [];
                }
            }
            
            currentParagraph.push(sentence);
            
            // Если это последнее предложение
            if (i === sentences.length - 1) {
                paragraphs.push(currentParagraph.join(' '));
            }
        }
        
        return paragraphs;
    }

    /**
     * Анализ предложения для определения его роли
     */
    analyzeSentence(sentence) {
        return {
            // Длина предложения
            length: sentence.length,
            
            // Есть ли восклицательный знак
            isExclamation: sentence.includes('!'),
            
            // Есть ли вопросительный знак
            isQuestion: sentence.includes('?'),
            
            // Начинается ли с вводных слов
            startsWithIntro: this.isIntroductoryWord(sentence),
            
            // Заканчивается ли на многоточие
            endsWithEllipsis: sentence.includes('...'),
            
            // Есть ли маркер списка
            isListItem: this.isListItem(sentence),
            
            // Является ли цитатой
            isQuote: sentence.startsWith('"') || sentence.startsWith('«'),
            
            // Ключевые слова (для тематической группировки)
            keywords: this.extractKeywords(sentence)
        };
    }

    /**
     * Проверка вводных слов
     */
    isIntroductoryWord(sentence) {
        let introWords = [
            'во-первых', 'во-вторых', 'в-третьих',
            'кроме того', 'более того', 'также',
            'однако', 'но', 'зато',
            'поэтому', 'потому что', 'так как',
            'сначала', 'потом', 'затем',
            'наконец', 'в итоге', 'таким образом',
            'например', 'к примеру', 'в частности',
            'вообще', 'в общем', 'кстати'
        ];
        
        let lowerSentence = sentence.toLowerCase();
        return introWords.some(word => lowerSentence.startsWith(word));
    }

    /**
     * Проверка, является ли предложение элементом списка
     */
    isListItem(sentence) {
        // Проверяем начало на цифры, буквы с точкой, тире
        let listPatterns = [
            /^\d+[\.\)]/,           // 1. или 1)
            /^[а-я]\)/,              // а) или б)
            /^[A-Za-z]\)/,           // a) или b)
            /^[-–—]/,                 // начинается с тире
            /^•/,                     // маркер списка
            /^[IVX]+\./               // римские цифры (I., II.)
        ];
        
        return listPatterns.some(pattern => pattern.test(sentence));
    }

    /**
     * Извлечение ключевых слов из предложения
     */
    extractKeywords(sentence) {
        // Простые ключевые слова для определения темы
        let commonWords = [
            'школа', 'урок', 'учитель', 'ученик', 'класс',
            'конкурс', 'мероприятие', 'праздник', 'событие',
            'спорт', 'музыка', 'искусство', 'наука',
            'победа', 'награда', 'приз', 'медаль',
            'интересно', 'важно', 'здорово', 'круто'
        ];
        
        let lowerSentence = sentence.toLowerCase();
        return commonWords.filter(word => lowerSentence.includes(word));
    }

    /**
     * Решение о начале нового абзаца
     */
    shouldStartNewParagraph(currentParagraph, sentenceInfo, index, totalSentences) {
        if (currentParagraph.length === 0) {
            return false;
        }

        // 1. Если абзац уже достиг максимального размера
        if (currentParagraph.length >= this.maxSentencesPerParagraph) {
            return true;
        }

        // 2. Если предложение начинается с вводного слова
        if (sentenceInfo.startsWithIntro && currentParagraph.length >= this.minSentencesPerParagraph) {
            return true;
        }

        // 3. Если это восклицание или вопрос (эмоциональный акцент)
        if ((sentenceInfo.isExclamation || sentenceInfo.isQuestion) && currentParagraph.length >= this.minSentencesPerParagraph) {
            return true;
        }

        // 4. Если это элемент списка
        if (sentenceInfo.isListItem) {
            return true;
        }

        // 5. Если это цитата
        if (sentenceInfo.isQuote && currentParagraph.length > 0) {
            return true;
        }

        // 6. Если резко меняется тема (нет общих ключевых слов с предыдущим)
        if (currentParagraph.length >= this.minSentencesPerParagraph) {
            let prevSentence = currentParagraph[currentParagraph.length - 1];
            let prevKeywords = this.extractKeywords(prevSentence);
            
            // Если нет общих ключевых слов и абзац уже не маленький
            if (prevKeywords.length > 0 && sentenceInfo.keywords.length > 0) {
                let commonKeywords = prevKeywords.filter(k => sentenceInfo.keywords.includes(k));
                if (commonKeywords.length === 0) {
                    return true;
                }
            }
        }

        // 7. Если осталось мало предложений (чтобы последний абзац не был слишком маленьким)
        let remainingSentences = totalSentences - index - 1;
        if (remainingSentences <= 2 && currentParagraph.length >= this.minSentencesPerParagraph) {
            // Лучше начать новый абзац, если осталось достаточно предложений
            if (remainingSentences >= this.minSentencesPerParagraph) {
                return true;
            }
        }

        return false;
    }

    /**
     * Дополнительное форматирование абзаца
     */
    formatParagraph(paragraph) {
        if (!paragraph) return '';
        
        // Убираем лишние пробелы
        let cleanParagraph = paragraph.replace(/\s+/g, ' ').trim();
        
        // Проверяем, что предложение заканчивается точкой
        if (!cleanParagraph.match(/[.!?]$/)) {
            cleanParagraph += '.';
        }
        
        return cleanParagraph;
    }
}

// Создаем глобальный экземпляр для использования в main.js
const textFormatter = new TextFormatter();