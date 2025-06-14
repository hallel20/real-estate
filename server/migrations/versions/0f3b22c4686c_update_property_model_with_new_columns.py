"""update property model with new columns

Revision ID: 0f3b22c4686c
Revises: e9e9da038931
Create Date: 2025-05-25 22:13:30.752962

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f3b22c4686c'
down_revision = 'e9e9da038931'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.add_column(sa.Column('year_built', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('amenities', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('property', schema=None) as batch_op:
        batch_op.drop_column('amenities')
        batch_op.drop_column('year_built')

    # ### end Alembic commands ###
