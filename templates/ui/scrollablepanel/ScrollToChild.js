var ScrollToChild = function (child, align) {
    if (!this.hasChild(child)) {
        return this;
    }

    switch (this.scrollMode) {
        case 0:
            AlignChild.call(this, child, 'y', align);
            break;

        case 1:
            AlignChild.call(this, child, 'x', align);
            break;

        default:
            AlignChild.call(this, child, 'y', align);
            AlignChild.call(this, child, 'x', align);
            break;
    }

    return this;
}

const AlignYModes = ['top', 'bottom', 'centerY', 'center'];
const AlignXModes = ['left', 'right', 'centerX', 'center'];

var AlignChild = function (child, axis, align) {
    axis = axis.toUpperCase();
    var isAxisY = (axis === 'Y');

    var scrollableBlock = this.childrenMap.child;
    var delta;
    if (isAxisY) {
        if (align) {
            for (var i = 0, cnt = AlignYModes.length; i < cnt; i++) {
                var modeName = AlignYModes[i];
                if (align.indexOf(modeName) !== -1) {
                    align = modeName;
                    break;
                }
            }
        }

        switch (align) {
            case 'top':
                delta = scrollableBlock.top - child.getTopLeft().y;
                break;

            case 'bottom':
                delta = scrollableBlock.bottom - child.getBottomLeft().y;
                break;

            case 'centerY':
            case 'center':
                delta = scrollableBlock.centerY - child.getCenter().y;
                break;

            default:
                var dTop = scrollableBlock.top - child.getTopLeft().y;
                var dBottom = scrollableBlock.bottom - child.getBottomLeft().y;
                if ((dTop <= 0) && (dBottom >= 0)) {
                    delta = 0;
                } else {
                    delta = (Math.abs(dTop) <= Math.abs(dBottom)) ? dTop : dBottom;
                }
                break;
        }
    } else {
        if (align) {
            for (var i = 0, cnt = AlignXModes.length; i < cnt; i++) {
                var modeName = AlignXModes[i];
                if (align.indexOf(modeName) !== -1) {
                    align = modeName;
                    break;
                }
            }
        }

        switch (align) {
            case 'left':
                delta = scrollableBlock.left - child.getTopLeft().x;
                break;

            case 'right':
                delta = scrollableBlock.right - child.getTopRight().x;
                break;

            case 'centerX':
            case 'center':
                delta = scrollableBlock.centerX - child.getCenter().x;
                break;

            default:
                var dLeft = scrollableBlock.left - child.getTopLeft().x;
                var dRight = scrollableBlock.right - child.getTopRight().x;
                if ((dLeft <= 0) && (dRight >= 0)) {
                    delta = 0;
                } else {
                    delta = (Math.abs(dLeft) <= Math.abs(dRight)) ? dLeft : dRight;
                }
                break;
        }
    }

    switch (this.scrollMode) {
        case 0:
        case 1:
            this.childOY += delta;
            break;

        default:
            this[`childO${axis}`] += delta;
            break;
    }
}
export default ScrollToChild;