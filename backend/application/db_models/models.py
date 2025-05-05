from exts import db


class BaseModel(db.Model):
    __abstract__ = True

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e


class User(BaseModel):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    username = db.Column(db.Text, unique=True)
    email = db.Column(db.Text)
    company = db.Column(db.Text)
    password = db.Column(db.Text)
    role = db.Column(db.Text)
    registration_date = db.Column(db.DateTime)

    # Связи с каскадным удалением
    participants = db.relationship("OrderParticipant", back_populates="user", cascade="all, delete-orphan")
    personal_orders = db.relationship("PersonalOrder", back_populates="user", cascade="all, delete-orphan")


class Order(BaseModel):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    publishing_date = db.Column(db.DateTime)
    title = db.Column(db.Text)
    description = db.Column(db.Text)
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id', ondelete="CASCADE"))
    permitted_providers = db.Column(db.JSON)
    participating_providers = db.Column(db.JSON)
    deadline = db.Column(db.DateTime)

    # Связи с каскадным удалением
    status = db.relationship("Status", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="orders", cascade="all, delete-orphan")
    participants = db.relationship("OrderParticipant", back_populates="order", cascade="all, delete-orphan")
    personal_orders = db.relationship("PersonalOrder", back_populates="order", cascade="all, delete-orphan")


class Item(BaseModel):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.Text)

    # Связи с каскадным удалением
    order_items = db.relationship("OrderItem", back_populates="item", cascade="all, delete-orphan")


class OrderItem(BaseModel):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete="CASCADE"))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id', ondelete="CASCADE"))
    amount = db.Column(db.Integer)

    # Связи с каскадным удалением
    orders = db.relationship("Order", back_populates="order_items")
    item = db.relationship("Item", back_populates="order_items")
    participant_prices = db.relationship("OrderParticipantPrice", back_populates="order_item",
                                         cascade="all, delete-orphan")


class OrderParticipant(BaseModel):
    __tablename__ = 'order_participants'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete="CASCADE"))
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id', ondelete="CASCADE"))
    is_participating = db.Column(db.Boolean, default = False)
    deadline = db.Column(db.DateTime)

    # Связи с каскадным удалением
    user = db.relationship("User", back_populates="participants")
    order = db.relationship("Order", back_populates="participants")
    status = db.relationship("Status", back_populates="participants")
    prices = db.relationship("OrderParticipantPrice", back_populates="participant", cascade="all, delete-orphan")
    last_prices = db.relationship("OrderParticipantLastPrice", back_populates="participant",
                                  cascade="all, delete-orphan")


class OrderParticipantPrice(BaseModel):
    __tablename__ = 'order_participants_prices'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    order_participant_id = db.Column(db.Integer, db.ForeignKey('order_participants.id', ondelete="CASCADE"))
    order_item_id = db.Column(db.Integer, db.ForeignKey('order_items.id', ondelete="CASCADE"))
    price = db.Column(db.Numeric(10, 2), default=None)
    comment = db.Column(db.Text)

    # Связи с каскадным удалением
    participant = db.relationship("OrderParticipant", back_populates="prices")
    order_item = db.relationship("OrderItem", back_populates="participant_prices")
    last_price = db.relationship("OrderParticipantLastPrice", back_populates="price", cascade="all, delete-orphan",
                                 uselist=False)
    personal_order_positions = db.relationship("PersonalOrderPosition", back_populates="price",
                                               cascade="all, delete-orphan")


class OrderParticipantLastPrice(BaseModel):
    __tablename__ = 'order_participants_last_prices'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    order_participant_id = db.Column(db.Integer, db.ForeignKey('order_participants.id', ondelete="CASCADE"))
    price_id = db.Column(db.Integer, db.ForeignKey('order_participants_prices.id', ondelete="CASCADE"))

    # Связи с каскадным удалением
    participant = db.relationship("OrderParticipant", back_populates="last_prices")
    price = db.relationship("OrderParticipantPrice", back_populates="last_price")


class Status(BaseModel):
    __tablename__ = 'statuses'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    code = db.Column(db.Integer)
    message = db.Column(db.Text)

    # Связи
    participants = db.relationship("OrderParticipant", back_populates="status")
    orders = db.relationship("Order", back_populates="status")


class PersonalOrder(BaseModel):
    __tablename__ = 'personal_orders'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete="CASCADE"))

    # Связи с каскадным удалением
    user = db.relationship("User", back_populates="personal_orders")
    order = db.relationship("Order", back_populates="personal_orders")
    positions = db.relationship("PersonalOrderPosition", back_populates="personal_order", cascade="all, delete-orphan")


class PersonalOrderPosition(BaseModel):
    __tablename__ = 'personal_order_positions'

    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    personal_order_id = db.Column(db.Integer, db.ForeignKey('personal_orders.id', ondelete="CASCADE"))
    price_id = db.Column(db.Integer, db.ForeignKey('order_participants_prices.id', ondelete="CASCADE"))

    # Связи
    personal_order = db.relationship("PersonalOrder", back_populates="positions")
    price = db.relationship("OrderParticipantPrice", back_populates="personal_order_positions")
