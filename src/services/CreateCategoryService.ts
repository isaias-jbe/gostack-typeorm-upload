import { getRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<string> {
    const formatted_title = await title
      .substring(0, 1)
      .toUpperCase()
      .concat(title.substring(1).toLowerCase());

    const categoriesRepository = getRepository(Category);

    const category = await categoriesRepository.findOne({
      where: { title: formatted_title },
    });

    if (!category) {
      const category = categoriesRepository.create({ title: formatted_title });

      await categoriesRepository.save(category);

      return category.id;
    }

    return category.id;
  }
}

export default CreateCategoryService;
