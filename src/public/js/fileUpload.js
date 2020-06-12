FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 286 / 381,
    imageResizeTargetWidth: 286,
    imageResizeTargetHeight: 381
})
  

FilePond.parse(document.body);