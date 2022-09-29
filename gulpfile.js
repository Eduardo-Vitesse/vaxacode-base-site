const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const ts = require("gulp-typescript");
const babel = require("gulp-babel");

// Compilar o SASS
function buildStyles() {
  return gulp
    .src("./scss/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}
gulp.task("sass", buildStyles);

//Copilando o TypeScript
function typescriptFunction() {
  return gulp
    .src("ts/**/*.ts")
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: "main.js",
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}
gulp.task("typescriptFunction", typescriptFunction);

// Abrir o navegador em um servidor
function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}
gulp.task("browser-sync", browser);

// Monitorar o sass
const watch = () => {
  gulp.watch("./scss/*.scss", buildStyles, browser);
  gulp.watch("./src/pages/*.php").on("change", browserSync.reload);
  gulp.watch("ts/**/*.ts", typescriptFunction);
};
gulp.task("watch", watch);

gulp.task(
  "default",
  gulp.parallel("watch", "browser-sync", "sass", "typescriptFunction")
);
