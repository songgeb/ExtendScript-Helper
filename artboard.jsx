//由于当前(2018年04月19日)官方api不支持画板属性查询，自己写个判断layer是否是画板的方法
function isArtboard (layer) {
    var itemIndex = layer.itemIndex;
    try {
        if (app.activeDocument.backgroundLayer) {
            itemIndex --;
        }
    } catch (e) {
    }

    var ref = new ActionReference();
    ref.putIndex(stringIDToTypeID("layer"), itemIndex);
    var desp = executeActionGet(ref);
    try {
        return desp.getBoolean(stringIDToTypeID("artboardEnabled"));
    } catch (e) {
        return false;
    }
}

//获取画板尺寸及距离整个画布左上角原点坐标
function getArtboardBounds (artboardLayer) {
    var originalRuler = app.preferences.rulerUnits;
    
    app.preferences.rulerUnits = Units.PIXELS;
    var itemIndex = artboardLayer.itemIndex;
    try {
        if (app.activeDocument.backgroundLayer) {
            itemIndex --;
        }
    } catch (e) {
    }
    var ref = new ActionReference();
    ref.putIndex(stringIDToTypeID("layer"), itemIndex);
    var desp = executeActionGet(ref);
    var theBounds = desp.getObjectValue(stringIDToTypeID('bounds'));
    var theX = theBounds.getInteger(stringIDToTypeID('left'));
    var theY = theBounds.getInteger(stringIDToTypeID('top'));
    var theX2 = theBounds.getInteger(stringIDToTypeID('right'));
    var theY2 = theBounds.getInteger(stringIDToTypeID('bottom'));
    
    app.preferences.rulerUnits = originalRuler;
    return [UnitValue(theX, "px"), UnitValue(theY, "px"), UnitValue(theX2, "px"), UnitValue(theY2, "px")];
}