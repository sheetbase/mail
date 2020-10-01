import {Options, Extendable, Category, Template} from '../types';

export class OptionService {
  private options: Options;

  constructor(options: Options) {
    this.options = {
      categories: {},
      templates: {},
      ...options,
    };
    // uncategorized category default
    if (!(this.options.categories as Record<string, Category>).uncategorized) {
      (this.options.categories as Record<string, Category>).uncategorized = {
        title: 'Uncategorized',
        major: false,
      };
    }
    // general template default
    if (!(this.options.templates as Record<string, unknown>).general) {
      (this.options.templates as Record<string, unknown>).general = (
        data: unknown
      ) =>
        `<p><code><pre>${JSON.stringify(data || {}, null, 2)}</pre></code></p>`;
    }
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: Options | Extendable) {
    return (this.options = {...this.options, ...options});
  }

  getCategory(categoryName: string) {
    const {categories} = this.options;
    // load from configs
    let category: string | Category =
      (categories as Record<string, Category>)[categoryName] ||
      (categories as Record<string, Category>).uncategorized;
    // turn string -> Category
    if (typeof category === 'string') {
      category = {title: category, major: true} as Category;
    }
    return category;
  }

  getCategoryByLabel(label: string) {
    let result: Category | undefined;
    for (const categoryName of Object.keys(
      this.options.categories as Record<string, Category>
    )) {
      const category = this.getCategory(categoryName);
      if (category.title === label.split('/').pop()) {
        result = category;
        break;
      }
    }
    return result;
  }

  addCategory(name: string, category: string | Category) {
    return ((this.options.categories as Record<string, string | Category>)[
      name
    ] = category);
  }

  getTemplate(templateName: string) {
    const {templates} = this.options;
    return ((templates as Record<string, unknown>)[templateName] ||
      (templates as Record<string, unknown>).general) as Template<unknown>;
  }

  addTemplate<Data>(name: string, template: Template<Data>) {
    return ((this.options.templates as Record<string, unknown>)[
      name
    ] = template);
  }
}
