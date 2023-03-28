const blogContent = document.querySelectorAll(".blog_content");

blogContent.forEach((blog) => {
  blog.addEventListener("click", () => {
    window.location.replace(`/blogs/${blog.dataset.id}`);
  });
});
