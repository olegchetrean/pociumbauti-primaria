        </div><!-- /.admin-content -->
    </main><!-- /.admin-main -->

    <!-- Admin JavaScript -->
    <script src="assets/js/admin-script.js"></script>

    <?php if (isset($use_editor) && $use_editor): ?>
    <script>
        // Configurare TinyMCE în limba română
        tinymce.init({
            selector: '#continut',
            language: 'ro',
            height: 400,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                'searchreplace', 'visualblocks', 'fullscreen', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic underline | ' +
                     'alignleft aligncenter alignright | ' +
                     'bullist numlist | link | removeformat',
            content_style: 'body { font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
            branding: false,
            promotion: false,
            statusbar: true,
            resize: true,
            placeholder: 'Scrieți conținutul aici...',
            // Validare output pentru securitate
            valid_elements: 'p,br,strong,em,u,ul,ol,li,a[href|target],h2,h3,h4,blockquote',
            invalid_elements: 'script,iframe,object,embed,form,input',
            // Configurări suplimentare
            paste_as_text: false,
            paste_word_valid_elements: 'p,br,strong,em,u,ul,ol,li,a[href],h2,h3,h4',
            link_default_target: '_blank',
            link_assume_external_targets: true
        });
    </script>
    <?php endif; ?>

    <?php if (isset($extra_js)): echo $extra_js; endif; ?>
</body>
</html>
