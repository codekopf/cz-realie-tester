# 🇬🇧Preparation for the Czech Realities Test

A web application for preparing for the Czech realities exam, which is part of the process of granting citizenship of the Czech Republic.

The application generates random tests of 30 questions (one from each thematic area) and evaluates the results. A minimum of 18 correct answers (60%) is required to pass. 
You can find test your knowledge in the [https://codekopf.github.io/cz-realie-tester/](https://codekopf.github.io/cz-realie-tester/).

# 🇨🇿Priprava na Test z českých reálií

Webová aplikace pro přípravu na zkoušku z českých reálií, která je součástí procesu udělení státního občanství České republiky.

Aplikace generuje náhodné testy po 30 otázkách (jedna z každého tematického okruhu) a vyhodnocuje výsledky. K úspěchu je potřeba minimálně 18 správných odpovědí (60%).
Své znalosti si můžete otestovat na [https://codekopf.github.io/cz-realie-tester/](https://codekopf.github.io/cz-realie-tester/).

# 🇺🇦Підготовка до тесту з чеських реалій

Веб-застосунок для підготовки до іспиту з чеських реалій, який є частиною процесу надання громадянства Чеської Республіки.

Застосунок генерує випадкові тести з 30 питань (по одному з кожного тематичного розділу) та оцінює результати. Для успішного складання необхідно щонайменше 18 правильних відповідей (60%).
Перевірити свої знання можна на [https://codekopf.github.io/cz-realie-tester/](https://codekopf.github.io/cz-realie-tester/).

# 🇻🇳Chuẩn bị cho bài kiểm tra thực tế Séc

Ứng dụng web để chuẩn bị cho kỳ thi về thực tế Séc, là một phần của quy trình cấp quốc tịch Cộng hòa Séc.

Ứng dụng tạo các bài kiểm tra ngẫu nhiên gồm 30 câu hỏi (mỗi câu từ một lĩnh vực chủ đề) và đánh giá kết quả. Cần tối thiểu 18 câu trả lời đúng (60%) để đạt.
Bạn có thể kiểm tra kiến thức của mình tại [https://codekopf.github.io/cz-realie-tester/](https://codekopf.github.io/cz-realie-tester/).

## Found bug? Have idea for improvement? 

Please feel free to create an issue or submit a pull request or contact me directly at andrej.buday (a) gmail.com . I will be happy to review it and make adjustment if it is good.

## Installation and deployment

### Technology and Requirements

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 7
- GitHub Pages
- [Node.js](https://nodejs.org/) version 18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/andrejbuday/cz-realie-test.git
cd cz-realie-test

# Install dependencies
npm install
```

### How to run an application in development mode

```bash
npm run dev
```

Application will be available at `http://localhost:5173/cz-realie-test/`.

### How to run a production build

```bash
npm run build
```

Static files will be generated in the `dist/` folder. You can deploy them to any static hosting.

## Question source

Questions are sourced from the [Database of test questions on Czech realities](https://cestina-pro-cizince.cz/obcanstvi/databanka-uloh/) operated by the National Pedagogical Institute of the Czech Republic.
