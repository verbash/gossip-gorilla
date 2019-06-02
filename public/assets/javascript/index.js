
$(document).ready(function() {
    var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
       $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();
          if (data && data.length) {
        renderArticles(data);
      } else {
              renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];
      for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
     articleContainer.append(articleCards);
  }

  function createCard(article) {
       var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn button1 save'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
      card.data("_id", article._id);
      return card;
  }

  function renderEmpty() {
      var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
        articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
       var articleToSave = $(this)
      .parents(".card")
      .data();

      $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
       $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
           if (data.saved) {
            initPage();
      }
    });
  }

  function handleArticleScrape() {
       $.get("/api/fetch").then(function(data) {
         initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  function handleArticleClear() {
    $.get("api/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }
});
