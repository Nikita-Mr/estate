<script>
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';
export default {};

tinymce.init({
  // Select the element(s) to add TinyMCE to using any valid CSS selector
  selector: '#myTextarea',
  plugins:
    'preview powerpaste casechange searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample advtable table charmap pagebreak nonbreaking anchor advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter permanentpen pageembed linkchecker emoticons export',
  height: '700px',
  toolbar_sticky: true,
  icons: 'thin',
  autosave_restore_when_empty: true,
});
</script>

<template>
  <div class="wrapperNews mt-1 mb-1">
    <input type="text" name="title" class="titleInput" id="" placeholder="заголовок новости">
    <textarea id="myTextarea"> </textarea>
    <button class="create-news">Создать</button>
  </div>
</template>

<style scoped>


  .titleInput {
    padding: 5px 7px;
    background-color: transparent;
    border: 1px solid #d5d5d5;
    box-shadow: 0px 0 10px 0 #ffffff71;
    border-radius: 15px;
    width: 30%;
  }

  .titleInput::placeholder {
    font-weight: 500;
    color: black;
  }
  .create-news {
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #62A87C;
    border-radius: 10px;
    color: #62A87C;
    font-weight: 600;
  }

  textarea {
    width: 90%;
    resize: none;
    height: 500px;
  }
  .wrapperNews{
    width: 100%;
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>