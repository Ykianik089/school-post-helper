/**
 * hashtags.js
 * Управление хэштегами для постов
 */

class HashtagManager {
    constructor() {
        // Стандартные хэштеги школы
        this.defaultTags = [
            '#школа',
            '#наросош5'
        ];
        
        // Текущие хэштеги (копия стандартных)
        this.currentTags = [...this.defaultTags];
        
        // Частотные теги для автоподбора
        this.commonTags = {
            'концерт': '#концерт',
            'праздник': '#праздник',
            'мероприятие': '#мероприятие',
            'конкурс': '#конкурс',
            'олимпиада': '#олимпиада',
            'спорт': '#спорт',
            'футбол': '#футбол',
            'баскетбол': '#баскетбол',
            'волейбол': '#волейбол',
            'экскурсия': '#экскурсия',
            'поход': '#поход',
            'музей': '#музей',
            'театр': '#театр',
            'кино': '#кино',
            'урок': '#урок',
            'перемена': '#перемена',
            'каникулы': '#каникулы',
            'выпускной': '#выпускной',
            'последний звонок': '#последнийзвонок',
            'день учителя': '#деньучителя',
            'день знаний': '#деньзнаний',
            'новый год': '#новыйгод',
            '8 марта': '#8марта',
            '23 февраля': '#23февраля',
            'победа': '#победа',
            'победители': '#победители',
            'грамота': '#грамота',
            'диплом': '#диплом',
            'медаль': '#медаль',
            'кубок': '#кубок',
            'талант': '#талант',
            'творчество': '#творчество',
            'рисунок': '#рисунок',
            'поделка': '#поделка',
            'выставка': '#выставка'
        };
    }

    /**
     * Получить все текущие хэштеги
     */
    getAllTags() {
        return this.currentTags;
    }

    /**
     * Получить строку с хэштегами
     */
    getTagsString() {
        if (this.currentTags.length === 0) {
            return '';
        }
        return this.currentTags.join(' ');
    }

    /**
     * Добавить хэштег
     */
    addTag(tag) {
        // Очищаем тег
        let cleanTag = this.cleanTag(tag);
        
        // Проверяем, что тег не пустой
        if (!cleanTag) {
            return false;
        }
        
        // Проверяем, есть ли уже такой тег
        if (!this.currentTags.includes(cleanTag)) {
            this.currentTags.push(cleanTag);
            return true;
        }
        
        return false;
    }

    /**
     * Удалить хэштег
     */
    removeTag(tag) {
        let index = this.currentTags.indexOf(tag);
        if (index !== -1) {
            this.currentTags.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Удалить хэштег по индексу
     */
    removeTagByIndex(index) {
        if (index >= 0 && index < this.currentTags.length) {
            this.currentTags.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Обновить хэштег
     */
    updateTag(oldTag, newTag) {
        let cleanNewTag = this.cleanTag(newTag);
        
        let index = this.currentTags.indexOf(oldTag);
        if (index !== -1 && cleanNewTag) {
            this.currentTags[index] = cleanNewTag;
            return true;
        }
        
        return false;
    }

    /**
     * Очистить все хэштеги
     */
    clearAllTags() {
        this.currentTags = [];
    }

    /**
     * Сбросить к стандартным
     */
    resetToDefault() {
        this.currentTags = [...this.defaultTags];
    }

    /**
     * Очистка и форматирование тега
     */
    cleanTag(tag) {
        if (!tag || tag.trim() === '') {
            return '';
        }
        
        let cleanTag = tag.trim();
        
        // Убираем пробелы внутри тега
        cleanTag = cleanTag.replace(/\s+/g, '');
        
        // Добавляем решетку, если её нет
        if (!cleanTag.startsWith('#')) {
            cleanTag = '#' + cleanTag;
        }
        
        // Приводим к нижнему регистру
        cleanTag = cleanTag.toLowerCase();
        
        return cleanTag;
    }

    /**
     * Автоматически подобрать хэштеги из текста
     */
    autoGenerateTags(text) {
        if (!text || text === '') {
            return [];
        }
        
        let foundTags = [];
        let lowerText = '';
        for (let i = 0; i < text.length; i++) {
            lowerText += text[i].toLowerCase();
        }
        
        // Ищем ключевые слова в тексте
        for (let word in this.commonTags) {
            if (lowerText.includes(word)) {
                let tag = this.commonTags[word];
                if (!foundTags.includes(tag) && !this.currentTags.includes(tag)) {
                    foundTags.push(tag);
                }
            }
        }
        
        return foundTags;
    }

    /**
     * Добавить автоматические теги
     */
    addAutoTags(text) {
        let autoTags = this.autoGenerateTags(text);
        
        for (let tag of autoTags) {
            this.addTag(tag);
        }
        
        return autoTags;
    }

    /**
     * Получить популярные теги для предложения
     */
    getSuggestedTags() {
        return [
            '#школа',
            '#ученики',
            '#учителя',
            '#класс',
            '#урок',
            '#перемена',
            '#каникулы',
            '#праздник',
            '#концерт',
            '#спорт',
            '#творчество',
            '#победа',
            '#новости',
            '#события',
            '#фото',
            '#видео'
        ];
    }

    /**
     * Установить свои теги (массивом)
     */
    setTags(tags) {
        if (!Array.isArray(tags)) {
            return false;
        }
        
        let newTags = [];
        for (let tag of tags) {
            let cleanTag = this.cleanTag(tag);
            if (cleanTag && !newTags.includes(cleanTag)) {
                newTags.push(cleanTag);
            }
        }
        
        if (newTags.length > 0) {
            this.currentTags = newTags;
            return true;
        }
        
        return false;
    }

    /**
     * Установить свои теги (строкой через пробел)
     */
    setTagsFromString(tagString) {
        if (!tagString || tagString.trim() === '') {
            return false;
        }
        
        let tagArray = tagString.split(' ');
        return this.setTags(tagArray);
    }

    /**
     * Количество тегов
     */
    count() {
        return this.currentTags.length;
    }

    /**
     * Проверка, есть ли тег
     */
    hasTag(tag) {
        let cleanTag = this.cleanTag(tag);
        return this.currentTags.includes(cleanTag);
    }
}

// Создаем глобальный экземпляр
const hashtagManager = new HashtagManager();